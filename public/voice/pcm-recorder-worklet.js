/**
 * Zeptaz Voice microphone capture worklet.
 *
 * Runs inside an AudioContext created at 16 kHz, so the frames it receives are
 * already at the rate the voice backend expects. Converts float samples to
 * signed 16-bit PCM and posts fixed-size chunks back to the main thread, which
 * forwards them over the WebSocket untouched.
 */
const DEFAULT_CHUNK_SAMPLES = 2048; // 128 ms at 16 kHz
const HYBRID_VAD_THRESHOLD = 0.014;
const HYBRID_VAD_SILENCE_MS = 550;

class PcmRecorder extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const requested = options?.processorOptions?.chunkSamples;
    // Keep a bounded, whole-sample packet size if a server-qualified profile
    // requests a lower capture latency.
    this.chunkSamples = Number.isInteger(requested) && requested >= 320 && requested <= 4000
      ? requested
      : DEFAULT_CHUNK_SAMPLES;
    this.buffer = new Int16Array(this.chunkSamples);
    this.filled = 0;
    this.hybridVad = options?.processorOptions?.hybridVad === true;
    this.speechActive = false;
    this.silentSamples = 0;
    this.port.onmessage = (event) => {
      if (event.data?.type === 'flush') this.flush();
    };
  }

  flush() {
    if (!this.filled) return;
    const chunk = this.buffer.slice(0, this.filled);
    this.port.postMessage(chunk.buffer, [chunk.buffer]);
    this.filled = 0;
  }

  trackHybridVad(channel) {
    if (!this.hybridVad) return;
    let energy = 0;
    for (let i = 0; i < channel.length; i++) energy += channel[i] * channel[i];
    const speaking = Math.sqrt(energy / channel.length) >= HYBRID_VAD_THRESHOLD;
    if (speaking) {
      this.speechActive = true;
      this.silentSamples = 0;
      return;
    }
    if (!this.speechActive) return;
    this.silentSamples += channel.length;
    if (this.silentSamples >= sampleRate * HYBRID_VAD_SILENCE_MS / 1000) {
      this.speechActive = false;
      this.silentSamples = 0;
      this.port.postMessage({ type: 'speech_end' });
    }
  }

  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (!channel) return true;
    this.trackHybridVad(channel);

    for (let i = 0; i < channel.length; i++) {
      const s = Math.max(-1, Math.min(1, channel[i]));
      this.buffer[this.filled++] = s < 0 ? s * 0x8000 : s * 0x7fff;
      if (this.filled === this.chunkSamples) {
        const chunk = new Int16Array(this.buffer);
        this.port.postMessage(chunk.buffer, [chunk.buffer]);
        this.filled = 0;
      }
    }
    return true;
  }
}

registerProcessor('pcm-recorder', PcmRecorder);
