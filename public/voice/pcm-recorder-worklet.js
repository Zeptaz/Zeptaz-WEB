/**
 * Zeptaz Voice — microphone capture worklet.
 *
 * Runs inside an AudioContext created at 16 kHz, so the frames it receives are
 * already at the rate the voice backend expects. Converts float samples to
 * signed 16-bit PCM and posts fixed-size chunks back to the main thread, which
 * forwards them over the WebSocket untouched.
 */
const CHUNK = 2048; // samples ≈ 128 ms at 16 kHz

class PcmRecorder extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Int16Array(CHUNK);
    this.filled = 0;
  }

  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (!channel) return true;

    for (let i = 0; i < channel.length; i++) {
      const s = Math.max(-1, Math.min(1, channel[i]));
      this.buffer[this.filled++] = s < 0 ? s * 0x8000 : s * 0x7fff;
      if (this.filled === CHUNK) {
        const chunk = new Int16Array(this.buffer);
        this.port.postMessage(chunk.buffer, [chunk.buffer]);
        this.filled = 0;
      }
    }
    return true;
  }
}

registerProcessor('pcm-recorder', PcmRecorder);
