'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { VoiceLanguageCode, VoiceScenario } from '@/lib/voice';
import { VoicePlaybackController } from '@/lib/voicePlayback';

const API_BASE = (process.env.NEXT_PUBLIC_VOICE_API_URL ?? '').replace(/\/+$/, '');
export const VOICE_DEMO_CONFIGURED = API_BASE.length > 0;

const CAPTURE_RATE = 16000;
const DEFAULT_PACKET_DURATION_MS = 128;
const MIN_PACKET_DURATION_MS = 20;
const MAX_PACKET_DURATION_MS = 250;
const READY_TIMEOUT_MS = 10_000;
const HEARTBEAT_MS = 15_000;

export type VoiceState =
  | 'unconfigured'
  | 'idle'
  | 'connecting'
  | 'waiting'
  | 'live'
  | 'ended'
  | 'error';

const STATUS: Record<VoiceState, string> = {
  unconfigured: 'The live preview is offline right now - book an assessment to hear it.',
  idle: 'Tap the microphone to start the call.',
  connecting: 'Connecting to the voice service…',
  waiting: 'Connected - waiting for the agent.',
  live: 'Listening - speak naturally.',
  ended: 'Call ended. Tap the microphone to start again.',
  error: 'Something went wrong. Tap the microphone to try again.',
};

type DemoGrant = {
  session_id: string;
  scenario: VoiceScenario['id'];
  language: VoiceLanguageCode;
  websocket_url: string;
  token: string;
  expires_at: number;
  max_duration_seconds: number;
  features: { full_duplex: boolean };
  input_format?: {
    encoding: string;
    sample_rate: number;
    channels: number;
    packet_duration_ms?: number;
  };
};

type ServerEvent = {
  type: string;
  code?: string;
  message?: string;
  reason?: string;
  playback_epoch?: number;
};

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

function validateGrant(
  value: unknown,
  expectedScenario: VoiceScenario['id'],
  expectedLanguage: VoiceLanguageCode,
): DemoGrant {
  if (!value || typeof value !== 'object') throw new Error('invalid_grant');
  const grant = value as Partial<DemoGrant>;
  if (
    typeof grant.session_id !== 'string' ||
    !grant.session_id.startsWith('demo-') ||
    grant.scenario !== expectedScenario ||
    grant.language !== expectedLanguage ||
    typeof grant.token !== 'string' ||
    grant.token.length < 32 ||
    typeof grant.websocket_url !== 'string' ||
    typeof grant.max_duration_seconds !== 'number' ||
    grant.max_duration_seconds < 1 ||
    grant.max_duration_seconds > 300
  ) {
    throw new Error('invalid_grant');
  }

  const apiUrl = new URL(API_BASE);
  const websocketUrl = new URL(grant.websocket_url);
  const secure = websocketUrl.protocol === 'wss:';
  const localDevelopment =
    websocketUrl.protocol === 'ws:' && ['localhost', '127.0.0.1'].includes(websocketUrl.hostname);
  if (
    (!secure && !localDevelopment) ||
    websocketUrl.host !== apiUrl.host ||
    websocketUrl.pathname !== `/ws/demo/${grant.session_id}` ||
    websocketUrl.username ||
    websocketUrl.password ||
    websocketUrl.searchParams.has('token')
  ) {
    throw new Error('invalid_websocket_url');
  }
  return grant as DemoGrant;
}

function packetDurationFromGrant(grant: DemoGrant): number {
  const duration = grant.input_format?.packet_duration_ms;
  if (
    typeof duration !== 'number' ||
    !Number.isInteger(duration) ||
    duration < MIN_PACKET_DURATION_MS ||
    duration > MAX_PACKET_DURATION_MS
  ) return DEFAULT_PACKET_DURATION_MS;
  return duration;
}

export function useVoiceSession() {
  const [state, setState] = useState<VoiceState>(VOICE_DEMO_CONFIGURED ? 'idle' : 'unconfigured');
  const [status, setStatus] = useState(VOICE_DEMO_CONFIGURED ? STATUS.idle : STATUS.unconfigured);

  const wsRef = useRef<WebSocket | null>(null);
  const micCtxRef = useRef<AudioContext | null>(null);
  const playCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const legacyRef = useRef<ScriptProcessorNode | null>(null);
  const sinkRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const playbackRef = useRef<VoicePlaybackController | null>(null);
  const fullDuplexRef = useRef(false);
  const startingRef = useRef(false);
  const openingRef = useRef(false);
  const packetDurationMsRef = useRef(DEFAULT_PACKET_DURATION_MS);
  const readyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearPlayback = useCallback((playbackEpoch?: number) => {
    playbackRef.current?.clear(playbackEpoch);
  }, []);

  const teardown = useCallback((next: VoiceState, message?: string) => {
    startingRef.current = false;
    openingRef.current = false;
    fullDuplexRef.current = false;

    if (readyTimer.current) clearTimeout(readyTimer.current);
    if (sessionTimer.current) clearTimeout(sessionTimer.current);
    if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
    readyTimer.current = null;
    sessionTimer.current = null;
    heartbeatTimer.current = null;

    const ws = wsRef.current;
    wsRef.current = null;
    if (ws) {
      ws.onopen = null;
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;
      if (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN) ws.close();
    }

    if (workletRef.current) {
      workletRef.current.port.onmessage = null;
      workletRef.current.port.close();
      workletRef.current.disconnect();
      workletRef.current = null;
    }
    if (legacyRef.current) {
      legacyRef.current.onaudioprocess = null;
      legacyRef.current.disconnect();
      legacyRef.current = null;
    }
    analyserRef.current?.disconnect();
    analyserRef.current = null;
    sourceRef.current?.disconnect();
    sourceRef.current = null;
    sinkRef.current?.disconnect();
    sinkRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    playbackRef.current?.dispose();
    playbackRef.current = null;

    for (const ref of [micCtxRef, playCtxRef]) {
      const ctx = ref.current;
      ref.current = null;
      if (ctx && ctx.state !== 'closed') void ctx.close();
    }

    setState(next);
    setStatus(message ?? STATUS[next]);
  }, []);

  const enqueue = useCallback((data: ArrayBuffer) => {
    playbackRef.current?.enqueue(data);
  }, []);

  const upload = useCallback((chunk: ArrayBuffer) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN || chunk.byteLength > 16_384) return;
    if (!fullDuplexRef.current && playbackRef.current?.isSpeaking()) return;
    ws.send(chunk);
  }, []);

  const openMic = useCallback(async () => {
    const ctx = micCtxRef.current;
    const stream = streamRef.current;
    if (!ctx || !stream || openingRef.current || workletRef.current || legacyRef.current) return;
    openingRef.current = true;
    const source = ctx.createMediaStreamSource(stream);
    sourceRef.current = source;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.8;
    source.connect(analyser);
    analyserRef.current = analyser;
    const sink = ctx.createGain();
    sink.gain.value = 0;
    sink.connect(ctx.destination);
    sinkRef.current = sink;

    if (ctx.audioWorklet) {
      await ctx.audioWorklet.addModule('/voice/pcm-recorder-worklet.js');
      if (!micCtxRef.current) return;
      const node = new AudioWorkletNode(ctx, 'pcm-recorder', {
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [1],
        processorOptions: { chunkSamples: Math.round(CAPTURE_RATE * packetDurationMsRef.current / 1000) },
      });
      node.port.onmessage = (event) => upload(event.data as ArrayBuffer);
      analyser.connect(node);
      node.connect(sink);
      workletRef.current = node;
    } else {
      const node = ctx.createScriptProcessor(4096, 1, 1);
      node.onaudioprocess = (event) => {
        const input = event.inputBuffer.getChannelData(0);
        event.outputBuffer.getChannelData(0).fill(0);
        const pcm = new Int16Array(input.length);
        for (let index = 0; index < input.length; index += 1) {
          const sample = Math.max(-1, Math.min(1, input[index]));
          pcm[index] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        }
        upload(pcm.buffer);
      };
      analyser.connect(node);
      node.connect(sink);
      legacyRef.current = node;
    }
    openingRef.current = false;
    startingRef.current = false;
    setState('live');
    setStatus(STATUS.live);
  }, [upload]);

  const start = useCallback(async (scenario: VoiceScenario, language: VoiceLanguageCode, history?: { save: boolean; noticeVersion: string }) => {
    if (!VOICE_DEMO_CONFIGURED || startingRef.current || wsRef.current) return;
    startingRef.current = true;
    setState('connecting');
    setStatus(STATUS.connecting);

    const Ctor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
    if (!Ctor || !navigator.mediaDevices?.getUserMedia) {
      teardown('error', 'This browser cannot capture audio. Try Chrome, Edge, or Safari 15+.');
      return;
    }
    try {
      const playCtx = new Ctor();
      playCtxRef.current = playCtx;
      await playCtx.resume();
      playbackRef.current = await VoicePlaybackController.create(playCtx);
      const micCtx = new Ctor({ sampleRate: CAPTURE_RATE });
      micCtxRef.current = micCtx;
      await micCtx.resume();
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch {
      teardown('error', 'Microphone access is needed for the voice preview.');
      return;
    }

    let grant: DemoGrant;
    try {
      const response = await fetch(`${API_BASE}/api/demo/sessions`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-store',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: scenario.id, language,
          save_history: history?.save === true,
          privacy_notice_version: history?.save ? history.noticeVersion : undefined }),
      });
      if (!response.ok) throw new Error(`session_${response.status}`);
      grant = validateGrant(await response.json(), scenario.id, language);
    } catch {
      teardown('error', 'The voice preview is busy or unavailable. Try again shortly.');
      return;
    }

    let ws: WebSocket;
    try {
      ws = new WebSocket(grant.websocket_url, ['zeptaz-demo', `token.${grant.token}`]);
    } catch {
      teardown('error', 'We could not reach the voice service. Try again shortly.');
      return;
    }
    ws.binaryType = 'arraybuffer';
    wsRef.current = ws;
    fullDuplexRef.current = Boolean(grant.features?.full_duplex);
    packetDurationMsRef.current = packetDurationFromGrant(grant);
    sessionTimer.current = setTimeout(
      () => teardown('ended', 'The demo time limit was reached. Tap the microphone to start again.'),
      grant.max_duration_seconds * 1000 + 1_000,
    );

    ws.onopen = () => {
      setState('waiting');
      setStatus(STATUS.waiting);
      readyTimer.current = setTimeout(
        () => teardown('error', 'The voice service did not respond. Try again shortly.'),
        READY_TIMEOUT_MS,
      );
      heartbeatTimer.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'ping' }));
      }, HEARTBEAT_MS);
    };
    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        enqueue(event.data);
        return;
      }
      if (typeof event.data !== 'string') return;
      let message: ServerEvent;
      try {
        message = JSON.parse(event.data) as ServerEvent;
      } catch {
        return;
      }
      if (message.type === 'ready') {
        if (readyTimer.current) clearTimeout(readyTimer.current);
        readyTimer.current = null;
        void openMic().catch(() => teardown('error', 'We could not open the microphone stream.'));
      } else if (message.type === 'playback.clear') {
        clearPlayback(message.playback_epoch);
      } else if (message.type === 'reconnecting') {
        clearPlayback();
        setStatus('The voice agent is reconnecting…');
      } else if (message.type === 'reconnected') {
        setStatus(STATUS.live);
      } else if (message.type === 'ended') {
        teardown(
          'ended',
          message.reason === 'demo_time_limit'
            ? 'The two-minute demo has finished. Tap the microphone to start again.'
            : undefined,
        );
      } else if (message.type === 'error') {
        teardown('error', 'The voice service ended the call. Try again shortly.');
      }
    };
    ws.onerror = () => teardown('error', 'We could not reach the voice service. Try again shortly.');
    ws.onclose = () => {
      if (wsRef.current === ws) teardown('ended');
    };
  }, [clearPlayback, enqueue, openMic, teardown]);

  const stop = useCallback(() => {
    const ws = wsRef.current;
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'end' }));
    teardown('ended');
  }, [teardown]);

  useEffect(() => () => teardown('idle'), [teardown]);
  const active = state === 'connecting' || state === 'waiting' || state === 'live';
  return { state, status, active, analyser: analyserRef, start, stop };
}
