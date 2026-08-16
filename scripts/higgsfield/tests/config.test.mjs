import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig, PALETTE } from '../config.mjs';

test('loadConfig builds the Higgsfield auth header', () => {
  const cfg = loadConfig({ HIGGSFIELD_API_KEY: 'k1', HIGGSFIELD_API_SECRET: 's1' });
  assert.equal(cfg.authHeader, 'Key k1:s1');
});

test('loadConfig throws naming every missing variable', () => {
  assert.throws(
    () => loadConfig({}),
    (err) => err.message.includes('HIGGSFIELD_API_KEY')
      && err.message.includes('HIGGSFIELD_API_SECRET'),
  );
});

test('loadConfig error never leaks a credential value', () => {
  try {
    loadConfig({ HIGGSFIELD_API_KEY: 'super-secret-value' });
    assert.fail('expected loadConfig to throw');
  } catch (err) {
    assert.ok(!err.message.includes('super-secret-value'));
    assert.ok(err.message.includes('HIGGSFIELD_API_SECRET'));
  }
});

test('PALETTE carries the live clay values and is frozen', () => {
  assert.equal(PALETTE.clay, '#C89574');
  assert.equal(PALETTE.bg, '#F6F1E7');
  assert.equal(PALETTE.text, '#2A2117');
  assert.equal(PALETTE.appLilac, '#9b8ec4');
  assert.ok(Object.isFrozen(PALETTE));
});
