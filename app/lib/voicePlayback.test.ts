import assert from 'node:assert/strict';
import test from 'node:test';

import { StreamingPcmBuffer } from '../../public/voice/pcm-stream-buffer.mjs';
import { VoicePlaybackController } from './voicePlayback.ts';

class FakePort {
  onmessage: ((event: { data: unknown }) => void) | null = null;
  messages: Array<{ message: Record<string, unknown>; transfer?: Transferable[] }> = [];
  closed = false;

  postMessage(message: Record<string, unknown>, transfer?: Transferable[]) {
    this.messages.push({ message, transfer });
  }

  emit(data: unknown) {
    this.onmessage?.({ data });
  }

  close() {
    this.closed = true;
  }
}

class FakeNode {
  port = new FakePort();
  connected = false;
  disconnected = false;
  connect() { this.connected = true; }
  disconnect() { this.disconnected = true; }
}

class FakeContext {
  state: AudioContextState = 'running';
  destination = {};
  loadedModules: string[] = [];
  audioWorklet = {
    addModule: async (url: string) => { this.loadedModules.push(url); },
  };
}

function pcm(sampleCount: number, value = 0): ArrayBuffer {
  const values = new Int16Array(sampleCount);
  values.fill(value);
  return values.buffer;
}

async function controller(context = new FakeContext()) {
  const node = new FakeNode();
  const playback = await VoicePlaybackController.create(
    context as unknown as AudioContext,
    {},
    () => node as unknown as AudioWorkletNode,
  );
  return { context, node, playback };
}

test('loads one persistent playback worklet and never creates per-frame sources', async () => {
  const { context, node } = await controller();

  assert.deepEqual(context.loadedModules, ['/voice/pcm-player-worklet.js']);
  assert.equal(node.connected, true);
});

test('forwards valid PCM frames to the same worklet stream', async () => {
  const { node, playback } = await controller();

  assert.equal(playback.enqueue(pcm(1)), true);
  assert.equal(playback.enqueue(pcm(1_200, 1_000)), true);
  assert.equal(node.port.messages.length, 2);
  assert.equal(node.port.messages[0].message.type, 'push');
  assert.equal(node.port.messages[0].message.generation, 0);
  assert.equal((node.port.messages[0].message.pcm as ArrayBuffer).byteLength, 2);
  assert.equal(playback.snapshotMetrics().coalescedTinyChunks, 1);
});

test('rejects malformed PCM before it reaches the worklet', async () => {
  const { node, playback } = await controller();

  assert.equal(playback.enqueue(new ArrayBuffer(3)), false);
  assert.equal(node.port.messages.length, 0);
  assert.equal(playback.snapshotMetrics().invalidChunks, 1);
});

test('clear generations discard stale state and stale interruption epochs', async () => {
  const { node, playback } = await controller();
  playback.enqueue(pcm(1_200));

  assert.equal(playback.clear(4), true);
  assert.equal(playback.clear(3), false);
  assert.equal(node.port.messages.at(-1)?.message.type, 'clear');
  assert.equal(node.port.messages.at(-1)?.message.generation, 1);
  node.port.emit({ type: 'state', generation: 0, playing: true, queuedSamples: 99_999, underruns: 4, droppedSamples: 5 });
  assert.equal(playback.isSpeaking(), false);
});

test('worklet state drives speaking and playback metrics', async () => {
  const { node, playback } = await controller();
  playback.enqueue(pcm(1_200));
  node.port.emit({ type: 'state', generation: 0, playing: true, queuedSamples: 600, underruns: 1, droppedSamples: 7 });

  assert.equal(playback.isSpeaking(), true);
  assert.equal(playback.snapshotMetrics().underruns, 1);
  assert.equal(playback.snapshotMetrics().droppedSamples, 7);
  node.port.emit({ type: 'state', generation: 0, playing: false, queuedSamples: 0, underruns: 1, droppedSamples: 7 });
  assert.equal(playback.isSpeaking(), false);
});

test('dispose closes and disconnects the persistent worklet', async () => {
  const { node, playback } = await controller();
  playback.dispose();

  assert.equal(node.port.messages.at(-1)?.message.type, 'dispose');
  assert.equal(node.port.closed, true);
  assert.equal(node.disconnected, true);
  assert.equal(playback.enqueue(pcm(1_200)), false);
});

test('fragmented Gemini frames render identically to one continuous PCM stream', () => {
  const samples = new Int16Array(7_201);
  for (let index = 0; index < samples.length; index += 1) {
    samples[index] = Math.round(Math.sin(index * 2 * Math.PI * 440 / 24_000) * 20_000);
  }
  const options = {
    inputRate: 24_000,
    outputRate: 48_000,
    initialBufferSeconds: 0,
    recoveryBufferSeconds: 0,
    fadeSeconds: 0,
    capacitySeconds: 2,
  };
  const continuous = new StreamingPcmBuffer(options);
  const fragmented = new StreamingPcmBuffer(options);
  continuous.pushInt16(samples);
  const sizes = [1, 1_440, 960, 1_920, 480, 2_400];
  let offset = 0;
  for (const size of sizes) {
    fragmented.pushInt16(samples.subarray(offset, offset + size));
    offset += size;
  }
  const continuousOutput = new Float32Array(14_000);
  const fragmentedOutput = new Float32Array(14_000);
  continuous.render(continuousOutput);
  fragmented.render(fragmentedOutput);

  assert.deepEqual(fragmentedOutput, continuousOutput);
});

test('drains the final interpolation sample instead of reporting permanent queued audio', () => {
  const stream = new StreamingPcmBuffer({
    inputRate: 24_000,
    outputRate: 48_000,
    initialBufferSeconds: 0,
    recoveryBufferSeconds: 0,
    fadeSeconds: 0,
    capacitySeconds: 1,
  });
  stream.pushInt16(new Int16Array(1_200).fill(5_000));
  stream.render(new Float32Array(3_000));

  assert.equal(stream.queuedSamples, 0);
  assert.equal(stream.playing, false);
});

test('interruption removes queued speech before new PCM is accepted', () => {
  const stream = new StreamingPcmBuffer({
    inputRate: 24_000,
    outputRate: 48_000,
    initialBufferSeconds: 0,
    recoveryBufferSeconds: 0,
    fadeSeconds: 0.004,
    capacitySeconds: 2,
  });
  stream.pushInt16(new Int16Array(2_000).fill(12_000));
  stream.render(new Float32Array(128));
  stream.clear();
  stream.pushInt16(new Int16Array(1_200).fill(-12_000));
  const output = new Float32Array(512);
  stream.render(output);

  assert.equal(stream.queuedSamples < 1_200, true);
  assert.equal(output.at(-1)! < 0, true);
});
