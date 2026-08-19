'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { VoiceScenario } from '@/lib/voice';

/* ─────────────────────────────────────────────────────────────────────────
   Live voice-demo session.

   Wire format (must stay in sync with the voice backend):
     connect   wss://HOST/ws/audio/{sessionId}?transport=binary&scenario=&lang=
     server →  one text frame (JSON config / "ready") before any audio
     client →  raw Int16 PCM, mono, 16 kHz, little-endian ArrayBuffers
     server →  raw Int16 PCM, mono, 24 kHz, played back in arrival order

   The session is half-duplex on purpose: while the agent's audio is still
   scheduled we stop uploading, so the agent never hears itself.
   ───────────────────────────────────────────────────────────────────────── */

const BASE = (process.env.NEXT_PUBLIC_VOICE_WS_URL ?? '').replace(/\/+$/, '');

/** False when NEXT_PUBLIC_VOICE_WS_URL is unset - the panel renders offline. */
export const VOICE_DEMO_CONFIGURED = BASE.length > 0;

const PLAYBACK_RATE = 24000;
const CAPTURE_RATE = 16000;
/** Keep the mic muted for a moment after the agent's last scheduled sample. */
const TAIL = 0.15;
/** How long we wait for the backend's ready frame before giving up. */
const READY_TIMEOUT = 10000;

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

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

function sessionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return `demo-${crypto.randomUUID()}`;
  return `demo-${Date.now().toString(36)}`;
}

export function useVoiceSession() {
  const [state, setState] = useState<VoiceState>(VOICE_DEMO_CONFIGURED ? 'idle' : 'unconfigured');
  const [status, setStatus] = useState<string>(
    VOICE_DEMO_CONFIGURED ? STATUS.idle : STATUS.unconfigured,
  );

  const wsRef = useRef<WebSocket | null>(null);
  const micCtxRef = useRef<AudioContext | null>(null);
  const playCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const legacyRef = useRef<ScriptProcessorNode | null>(null);
  const sinkRef = useRef<GainNode | null>(null);
  /** Read every frame by the visualiser; null whenever no call is running. */
  const analyserRef = useRef<AnalyserNode | null>(null);

  const playCursor = useRef(0);
  const speakingUntil = useRef(0);
  const startingRef = useRef(false);
  const openingRef = useRef(false);
  const readyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const teardown = useCallback((next: VoiceState, message?: string) => {
    startingRef.current = false;
    openingRef.current = false;

    if (readyTimer.current) {
      clearTimeout(readyTimer.current);
      readyTimer.current = null;
    }

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

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    for (const ref of [micCtxRef, playCtxRef]) {
      const ctx = ref.current;
      ref.current = null;
      if (ctx && ctx.state !== 'closed') ctx.close().catch(() => {});
    }

    playCursor.current = 0;
    speakingUntil.current = 0;

    setState(next);
    setStatus(message ?? STATUS[next]);
  }, []);

  /** Queue one inbound PCM frame on the playback cursor. */
  const enqueue = useCallback((data: ArrayBuffer) => {
    const ctx = playCtxRef.current;
    if (!ctx || ctx.state === 'closed') return;

    const pcm = new Int16Array(data);
    if (pcm.length === 0) return;

    const floats = new Float32Array(pcm.length);
    for (let i = 0; i < pcm.length; i++) floats[i] = pcm[i] / (pcm[i] < 0 ? 0x8000 : 0x7fff);

    const buffer = ctx.createBuffer(1, floats.length, PLAYBACK_RATE);
    buffer.copyToChannel(floats, 0);

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);

    const now = ctx.currentTime;
    if (playCursor.current < now) playCursor.current = now;
    src.start(playCursor.current);
    playCursor.current += buffer.duration;
    speakingUntil.current = Math.max(speakingUntil.current, playCursor.current + TAIL);
  }, []);

  /** Send one captured chunk, unless the agent is still speaking. */
  const upload = useCallback((chunk: ArrayBuffer) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    const play = playCtxRef.current;
    if (play && play.currentTime < speakingUntil.current) return;
    ws.send(chunk);
  }, []);

  /** Build the capture graph once the backend says it is ready. */
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

    // Silent sink - the graph only pulls frames while it reaches a destination.
    const sink = ctx.createGain();
    sink.gain.value = 0;
    sink.connect(ctx.destination);
    sinkRef.current = sink;

    if (ctx.audioWorklet) {
      await ctx.audioWorklet.addModule('/voice/pcm-recorder-worklet.js');
      if (!micCtxRef.current) return; // torn down while the module loaded
      const node = new AudioWorkletNode(ctx, 'pcm-recorder', {
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [1],
      });
      node.port.onmessage = (e) => upload(e.data as ArrayBuffer);
      analyser.connect(node);
      node.connect(sink);
      workletRef.current = node;
    } else {
      // Safari < 14.1 and friends: the deprecated processor still works.
      const node = ctx.createScriptProcessor(4096, 1, 1);
      node.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        e.outputBuffer.getChannelData(0).fill(0);
        const pcm = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
          const s = Math.max(-1, Math.min(1, input[i]));
          pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
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

  const start = useCallback(
    async (scenario: VoiceScenario) => {
      if (!VOICE_DEMO_CONFIGURED || startingRef.current || wsRef.current) return;
      startingRef.current = true;
      setState('connecting');
      setStatus(STATUS.connecting);

      // Audio contexts and the mic prompt stay inside the click gesture -
      // Safari and iOS refuse to unlock audio from an async callback later on.
      const Ctor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
      if (!Ctor || !navigator.mediaDevices?.getUserMedia) {
        teardown('error', 'This browser cannot capture audio. Try Chrome, Edge, or Safari 15+.');
        return;
      }

      try {
        const playCtx = new Ctor();
        playCtxRef.current = playCtx;
        await playCtx.resume();
        playCursor.current = playCtx.currentTime;

        const micCtx = new Ctor({ sampleRate: CAPTURE_RATE });
        micCtxRef.current = micCtx;
        await micCtx.resume();
      } catch {
        teardown('error', 'This browser cannot start audio playback.');
        return;
      }

      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      } catch {
        teardown('error', 'Microphone access is needed for the voice preview.');
        return;
      }

      const url =
        `${BASE}/ws/audio/${sessionId()}?transport=binary` +
        `&scenario=${encodeURIComponent(scenario.id)}&lang=${encodeURIComponent(scenario.locale)}`;

      let ws: WebSocket;
      try {
        ws = new WebSocket(url);
      } catch {
        teardown('error', 'We could not reach the voice service. Try again shortly.');
        return;
      }
      ws.binaryType = 'arraybuffer';
      wsRef.current = ws;

      ws.onopen = () => {
        setState('waiting');
        setStatus(STATUS.waiting);
        readyTimer.current = setTimeout(() => {
          if (!openingRef.current && !workletRef.current && !legacyRef.current) {
            teardown('error', 'The voice service did not respond. Try again shortly.');
          }
        }, READY_TIMEOUT);
      };

      ws.onmessage = (e) => {
        if (typeof e.data === 'string') {
          if (readyTimer.current) {
            clearTimeout(readyTimer.current);
            readyTimer.current = null;
          }
          void openMic().catch(() =>
            teardown('error', 'We could not open the microphone stream.'),
          );
          return;
        }
        if (e.data instanceof ArrayBuffer) enqueue(e.data);
      };

      ws.onerror = () => teardown('error', 'We could not reach the voice service. Try again shortly.');
      ws.onclose = () => {
        if (wsRef.current === ws) teardown('ended');
      };
    },
    [teardown, openMic, enqueue],
  );

  const stop = useCallback(() => teardown('ended'), [teardown]);

  useEffect(() => () => teardown('idle'), [teardown]);

  const active = state === 'connecting' || state === 'waiting' || state === 'live';

  return { state, status, active, analyser: analyserRef, start, stop };
}
