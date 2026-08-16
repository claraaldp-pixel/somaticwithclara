import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateShot, validateManifest, loadManifest } from '../manifest.mjs';

const validVideoShot = {
  id: 'drift-01',
  model: 'higgsfield-ai/dop/preview',
  type: 'image-to-video',
  prompt: 'slow gentle push in',
  firstFrame: 'out/frames/phone-linen.png',
  imageUrl: 'https://example.com/phone-linen.png',
};

test('a well-formed shot produces no errors', () => {
  assert.deepEqual(validateShot(validVideoShot, 0), []);
});

test('missing required fields are reported by name', () => {
  const errors = validateShot({ id: 'x' }, 0);
  assert.ok(errors.some((e) => e.includes('model')));
  assert.ok(errors.some((e) => e.includes('type')));
  assert.ok(errors.some((e) => e.includes('prompt')));
});

test('an unknown type is rejected', () => {
  const errors = validateShot({ ...validVideoShot, type: 'text-to-song' }, 0);
  assert.ok(errors.some((e) => e.includes('type')));
});

test('image-to-video requires a firstFrame', () => {
  const { firstFrame, ...noFrame } = validVideoShot;
  const errors = validateShot(noFrame, 0);
  assert.ok(errors.some((e) => e.includes('firstFrame')));
});

test('image-to-video requires a valid imageUrl', () => {
  const { imageUrl, ...noUrl } = validVideoShot;
  const errors = validateShot(noUrl, 0);
  assert.ok(errors.some((e) => e.includes('imageUrl')));

  const placeholderErrors = validateShot({ ...validVideoShot, imageUrl: 'PHONE_LINEN_URL' }, 0);
  assert.ok(placeholderErrors.some((e) => e.includes('imageUrl')));
});

test('text-to-image does not require a firstFrame', () => {
  const errors = validateShot({
    id: 'still-01',
    model: 'higgsfield-ai/soul/standard',
    type: 'text-to-image',
    prompt: 'warm linen light',
  }, 0);
  assert.deepEqual(errors, []);
});

test('duplicate shot ids are rejected', () => {
  const errors = validateManifest([validVideoShot, { ...validVideoShot }]);
  assert.ok(errors.some((e) => e.includes('duplicate')));
});

test('a non-array manifest is rejected', () => {
  const errors = validateManifest({ id: 'nope' });
  assert.ok(errors.some((e) => e.includes('array')));
});

test('loadManifest round-trips a valid manifest and throws with the file path for an invalid one', () => {
  const validPath = join(tmpdir(), `higgsfield-manifest-valid-${process.pid}.json`);
  const invalidPath = join(tmpdir(), `higgsfield-manifest-invalid-${process.pid}.json`);
  try {
    writeFileSync(validPath, JSON.stringify([validVideoShot]));
    const shots = loadManifest(validPath);
    assert.deepEqual(shots, [validVideoShot]);

    writeFileSync(invalidPath, JSON.stringify([{ id: 'broken' }]));
    assert.throws(
      () => loadManifest(invalidPath),
      (err) => err.message.includes(invalidPath),
    );
  } finally {
    rmSync(validPath, { force: true });
    rmSync(invalidPath, { force: true });
  }
});
