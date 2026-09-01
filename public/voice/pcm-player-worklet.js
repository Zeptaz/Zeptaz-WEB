import { StreamingPcmBuffer } from './pcm-stream-buffer.mjs';

class PcmStreamPlayer extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const config = options.processorOptions || {};
    this.player = new StreamingPcmBuffer({
      inputRate: config.inputRate || 24_000,
      outputRate: sampleRate,
      initialBufferSeconds: config.initialBufferSeconds ?? 0.05,
      recoveryBufferSeconds: config.recoveryBufferSeconds ?? 0.03,
      fadeSeconds: config.fadeSeconds ?? 0.004,
      capacitySeconds: config.capacitySeconds ?? 30,
    });
    this.generation = 0;
    this.disposed = false;
    this.reportCountdown = 0;
    this.port.onmessage = (event) => this.handleMessage(event.data || {});
    this.report('ready');
  }

  handleMessage(message) {
    if (message.type === 'push') {
      if (message.generation !== this.generation || !(message.pcm instanceof ArrayBuffer)) return;
      const result = this.player.pushInt16(new Int16Array(message.pcm));
      this.report(result.dropped ? 'overflow' : 'queued');
    } else if (message.type === 'clear') {
      if (!Number.isInteger(message.generation) || message.generation < this.generation) return;
      this.generation = message.generation;
      this.player.clear();
      this.report('cleared');
    } else if (message.type === 'dispose') {
      this.player.clear();
      this.disposed = true;
    }
  }

  report(event, state) {
    this.port.postMessage({
      type: 'state',
      event,
      generation: this.generation,
      playing: state ? state.playing : this.player.playing,
      queuedSamples: this.player.queuedSamples,
      underruns: this.player.underruns,
      droppedSamples: this.player.droppedSamples,
    });
  }

  process(_inputs, outputs) {
    if (this.disposed) return false;
    const output = outputs[0] && outputs[0][0];
    if (!output) return true;
    const state = this.player.render(output);
    this.reportCountdown -= 1;
    if (state.started || state.underrun || this.reportCountdown <= 0) {
      this.report(state.underrun ? 'underrun' : state.started ? 'started' : 'progress', state);
      this.reportCountdown = 16;
    }
    return true;
  }
}

registerProcessor('pcm-stream-player', PcmStreamPlayer);
