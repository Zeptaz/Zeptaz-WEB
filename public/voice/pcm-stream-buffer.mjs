export class StreamingPcmBuffer {
  constructor({
    inputRate = 24_000,
    outputRate,
    initialBufferSeconds = 0.05,
    recoveryBufferSeconds = 0.03,
    fadeSeconds = 0.004,
    capacitySeconds = 30,
  }) {
    if (!(inputRate > 0) || !(outputRate > 0) || !(capacitySeconds > 0)) {
      throw new Error('invalid_pcm_stream_configuration');
    }
    this.inputRate = inputRate;
    this.outputRate = outputRate;
    this.ratio = inputRate / outputRate;
    this.initialSamples = Math.max(2, Math.ceil(initialBufferSeconds * inputRate));
    this.recoverySamples = Math.max(2, Math.ceil(recoveryBufferSeconds * inputRate));
    this.fadeFrames = Math.max(1, Math.ceil(fadeSeconds * outputRate));
    this.buffer = new Float32Array(Math.ceil(capacitySeconds * inputRate));
    this.readIndex = 0;
    this.writeIndex = 0;
    this.queuedSamples = 0;
    this.phase = 0;
    this.playing = false;
    this.recovering = false;
    this.fadeInRemaining = 0;
    this.fadeOutRemaining = 0;
    this.fadeAnchor = 0;
    this.lastOutput = 0;
    this.underruns = 0;
    this.droppedSamples = 0;
  }

  pushInt16(samples) {
    const accepted = Math.min(samples.length, this.buffer.length - this.queuedSamples);
    for (let index = 0; index < accepted; index += 1) {
      const sample = samples[index];
      this.buffer[this.writeIndex] = sample / (sample < 0 ? 0x8000 : 0x7fff);
      this.writeIndex = (this.writeIndex + 1) % this.buffer.length;
    }
    this.queuedSamples += accepted;
    const dropped = samples.length - accepted;
    this.droppedSamples += dropped;
    return { accepted, dropped };
  }

  clear() {
    this.readIndex = 0;
    this.writeIndex = 0;
    this.queuedSamples = 0;
    this.phase = 0;
    this.playing = false;
    this.recovering = false;
    this.fadeInRemaining = 0;
    this.fadeAnchor = this.lastOutput;
    this.fadeOutRemaining = Math.abs(this.fadeAnchor) > 0.000001 ? this.fadeFrames : 0;
    this.lastOutput = 0;
  }

  render(output) {
    output.fill(0);
    let started = false;
    let underrun = false;

    for (let frame = 0; frame < output.length; frame += 1) {
      if (this.fadeOutRemaining > 0) {
        output[frame] = this.fadeAnchor * (this.fadeOutRemaining / this.fadeFrames);
        this.fadeOutRemaining -= 1;
        if (this.fadeOutRemaining === 0) this.fadeAnchor = 0;
        continue;
      }

      if (!this.playing) {
        const threshold = this.recovering ? this.recoverySamples : this.initialSamples;
        if (this.queuedSamples < threshold) continue;
        this.playing = true;
        this.recovering = false;
        this.fadeInRemaining = this.fadeFrames;
        started = true;
      }

      if (this.queuedSamples < 2) {
        this.readIndex = this.writeIndex;
        this.queuedSamples = 0;
        this.phase = 0;
        this.playing = false;
        this.recovering = true;
        this.underruns += 1;
        underrun = true;
        this.fadeAnchor = this.lastOutput;
        this.fadeOutRemaining = Math.abs(this.fadeAnchor) > 0.000001 ? this.fadeFrames : 0;
        this.lastOutput = 0;
        frame -= 1;
        continue;
      }

      const nextIndex = (this.readIndex + 1) % this.buffer.length;
      const first = this.buffer[this.readIndex];
      const second = this.buffer[nextIndex];
      const sample = first + (second - first) * this.phase;
      let gain = 1;
      if (this.fadeInRemaining > 0) {
        gain = 1 - this.fadeInRemaining / this.fadeFrames;
        this.fadeInRemaining -= 1;
      }
      output[frame] = sample * gain;
      this.lastOutput = output[frame];

      this.phase += this.ratio;
      while (this.phase >= 1 && this.queuedSamples > 1) {
        this.phase -= 1;
        this.readIndex = (this.readIndex + 1) % this.buffer.length;
        this.queuedSamples -= 1;
      }
    }

    return {
      started,
      underrun,
      playing: this.playing || this.fadeOutRemaining > 0,
      queuedSamples: this.queuedSamples,
      underruns: this.underruns,
      droppedSamples: this.droppedSamples,
    };
  }
}
