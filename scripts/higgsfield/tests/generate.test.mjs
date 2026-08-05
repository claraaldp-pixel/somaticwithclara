import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs, buildRequestBody, main } from '../generate.mjs';

test('parseArgs defaults to no confirmation', () => {
  const args = parseArgs(['shots.drift.json']);
  assert.equal(args.manifestPath, 'shots.drift.json');
  assert.equal(args.confirm, false);
  assert.equal(args.only, null);
});

test('parseArgs recognises --confirm', () => {
  assert.equal(parseArgs(['shots.json', '--confirm']).confirm, true);
});

test('parseArgs recognises --only', () => {
  assert.equal(parseArgs(['shots.json', '--only', 'drift-01']).only, 'drift-01');
});

test('parseArgs finds the manifest even when flags come first', () => {
  const args = parseArgs(['--only', 'drift-01', 'shots.json']);
  assert.equal(args.manifestPath, 'shots.json');
  assert.equal(args.only, 'drift-01');
});

test('buildRequestBody sends prompt and merged params', () => {
  const body = buildRequestBody({
    id: 'still-01',
    model: 'higgsfield-ai/soul/standard',
    type: 'text-to-image',
    prompt: 'warm linen light',
    params: { aspect_ratio: '9:16', resolution: '1080p' },
  });
  assert.equal(body.prompt, 'warm linen light');
  assert.equal(body.aspect_ratio, '9:16');
  assert.equal(body.resolution, '1080p');
  assert.ok(!('image_url' in body));
});

test('buildRequestBody includes image_url for image-to-video shots', () => {
  const body = buildRequestBody({
    id: 'drift-01',
    model: 'higgsfield-ai/dop/preview',
    type: 'image-to-video',
    prompt: 'slow push in',
    firstFrame: '/abs/path/phone-linen.png',
    imageUrl: 'https://example.com/phone-linen.png',
    params: { camera_fixed: true, duration: 5 },
  });
  assert.equal(body.image_url, 'https://example.com/phone-linen.png');
  assert.equal(body.camera_fixed, true);
  assert.equal(body.duration, 5);
});

test('parseArgs flags --only with no value as invalid', () => {
  const args = parseArgs(['shots.json', '--confirm', '--only']);
  assert.equal(args.onlyInvalid, true);
  assert.equal(args.only, null);
});

test('parseArgs flags --only with flag-like value as invalid', () => {
  const args = parseArgs(['shots.json', '--only', '--confirm']);
  assert.equal(args.onlyInvalid, true);
  assert.equal(args.only, null);
});

test('main exits with error if --only is invalid', async () => {
  let exitCode = null;
  let errorMsg = null;
  const mocks = {
    load: () => { throw new Error('should not call load'); },
    makeClient: () => { throw new Error('should not call makeClient'); },
    getConfig: () => { throw new Error('should not call getConfig'); },
  };

  const originalExit = process.exit;
  const originalError = console.error;
  try {
    process.exit = (code) => { exitCode = code; throw new Error('exit'); };
    console.error = (msg) => { errorMsg = msg; };
    await main(['shots.json', '--only'], mocks);
  } catch (e) {
    if (e.message !== 'exit') throw e;
  } finally {
    process.exit = originalExit;
    console.error = originalError;
  }

  assert.equal(exitCode, 1);
  assert.match(errorMsg, /--only requires a value/);
});

test('main does not call getConfig or makeClient without --confirm', async () => {
  let configCalled = false;
  let clientCalled = false;

  const mocks = {
    load: () => [
      { id: 'test-01', type: 'text-to-image', model: 'test', prompt: 'test' },
    ],
    makeClient: () => { clientCalled = true; return {}; },
    getConfig: () => { configCalled = true; return {}; },
  };

  const originalLog = console.log;
  try {
    console.log = () => {};
    await main(['shots.json'], mocks);
  } finally {
    console.log = originalLog;
  }

  assert.equal(configCalled, false);
  assert.equal(clientCalled, false);
});
