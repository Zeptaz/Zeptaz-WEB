export type VoicePlaybackMetrics = {
  receivedChunks: number;
  receivedBytes: number;
  invalidChunks: number;
  coalescedTinyChunks: number;
  scheduledBlocks: number;
  underruns: number;
  largestUnderrunMs: number;
  droppedSamples: number;
};

type VoicePlaybackOptions = {
  inputRate: number;
  initialBufferSeconds: number;
  recoveryBufferSeconds: number;
  minimumBlockSeconds: number;
  suppressionTailSeconds: number;
  fadeSeconds: number;
  capacitySeconds: number;
  workletUrl: string;
};

type PlaybackStateMessage = {
  type: 'state';
  generation: number;
  playing: boolean;
  queuedSamples: number;
  underruns: number;
  droppedSamples: number;
};

export type VoicePlaybackNodeFactory = (
  context: AudioContext,
  options: AudioWorkletNodeOptions,
) => AudioWorkletNode;

const DEFAULT_OPTIONS: VoicePlaybackOptions = {
  inputRate: 24_000,
  initialBufferSeconds: 0.05,
  recoveryBufferSeconds: 0.03,
  minimumBlockSeconds: 0.02,
  suppressionTailSeconds: 0.15,
  fadeSeconds: 0.004,
  capacitySeconds: 30,
  workletUrl: '/voice/pcm-player-worklet.js',
};

/**
 * Feeds Gemini PCM into one persistent AudioWorklet stream.
 *
 * WebSocket frames are transport boundaries, not audio boundaries. Keeping a
 * single ring buffer preserves interpolation and resampler state across every
 * frame and prevents the clicks/tones produced by separate buffer sources.
 */
export class VoicePlaybackController {
  private readonly context: AudioContext;
  private readonly options: VoicePlaybackOptions;
  private readonly node: AudioWorkletNode;
  private generation = 0;
  private lastClearEpoch = -1;
  private queuedSamples = 0;
  private playing = false;
  private disposed = false;
  private readonly metrics: VoicePlaybackMetrics = {
    receivedChunks: 0,
    receivedBytes: 0,
    invalidChunks: 0,
    coalescedTinyChunks: 0,
    scheduledBlocks: 0,
    underruns: 0,
    largestUnderrunMs: 0,
    droppedSamples: 0,
  };

  static async create(
    context: AudioContext,
    options: Partial<VoicePlaybackOptions> = {},
    nodeFactory: VoicePlaybackNodeFactory = (audioContext, nodeOptions) =>
      new AudioWorkletNode(audioContext, 'pcm-stream-player', nodeOptions),
  ): Promise<VoicePlaybackController> {
    const resolved = { ...DEFAULT_OPTIONS, ...options };
    if (!context.audioWorklet) throw new Error('audio_worklet_unavailable');
    await context.audioWorklet.addModule(resolved.workletUrl);
    const node = nodeFactory(context, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [1],
      processorOptions: {
        inputRate: resolved.inputRate,
        initialBufferSeconds: resolved.initialBufferSeconds,
        recoveryBufferSeconds: resolved.recoveryBufferSeconds,
        fadeSeconds: resolved.fadeSeconds,
        capacitySeconds: resolved.capacitySeconds,
      },
    });
    return new VoicePlaybackController(context, resolved, node);
  }

  private constructor(context: AudioContext, options: VoicePlaybackOptions, node: AudioWorkletNode) {
    this.context = context;
    this.options = options;
    this.node = node;
    this.node.port.onmessage = (event: MessageEvent<PlaybackStateMessage>) => {
      const state = event.data;
      if (!state || state.type !== 'state' || state.generation !== this.generation) return;
      this.playing = Boolean(state.playing);
      this.queuedSamples = Math.max(0, Number(state.queuedSamples) || 0);
      this.metrics.underruns = Math.max(this.metrics.underruns, Number(state.underruns) || 0);
      this.metrics.droppedSamples = Math.max(this.metrics.droppedSamples, Number(state.droppedSamples) || 0);
    };
    this.node.connect(context.destination);
  }

  enqueue(data: ArrayBuffer): boolean {
    if (this.disposed || this.context.state === 'closed' || data.byteLength === 0 || data.byteLength % 2 !== 0) {
      this.metrics.invalidChunks += 1;
      return false;
    }
    const samples = data.byteLength / 2;
    this.metrics.receivedChunks += 1;
    this.metrics.receivedBytes += data.byteLength;
    this.metrics.scheduledBlocks += 1;
    if (samples < Math.ceil(this.options.minimumBlockSeconds * this.options.inputRate)) {
      this.metrics.coalescedTinyChunks += 1;
    }
    this.queuedSamples += samples;
    const pcm = data.slice(0);
    this.node.port.postMessage({ type: 'push', generation: this.generation, pcm }, [pcm]);
    return true;
  }

  clear(playbackEpoch?: number): boolean {
    if (typeof playbackEpoch === 'number') {
      if (!Number.isFinite(playbackEpoch) || playbackEpoch <= this.lastClearEpoch) return false;
      this.lastClearEpoch = playbackEpoch;
    }
    if (this.disposed) return false;
    this.generation += 1;
    this.queuedSamples = 0;
    this.playing = false;
    this.node.port.postMessage({ type: 'clear', generation: this.generation });
    return true;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.queuedSamples = 0;
    this.playing = false;
    this.node.port.onmessage = null;
    this.node.port.postMessage({ type: 'dispose' });
    this.node.port.close();
    this.node.disconnect();
  }

  isSpeaking(): boolean {
    return this.playing || this.queuedSamples > 0;
  }

  snapshotMetrics(): Readonly<VoicePlaybackMetrics> {
    return { ...this.metrics };
  }
}
