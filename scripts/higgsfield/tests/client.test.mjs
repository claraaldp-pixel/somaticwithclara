import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createClient, BASE_URL } from '../client.mjs';

const ok = (body) => ({ ok: true, status: 200, json: async () => body });
const noSleep = () => Promise.resolve();

test('submit POSTs to the model path with the auth header', async () => {
  const calls = [];
  const client = createClient({
    authHeader: 'Key k:s',
    fetchImpl: async (url, opts) => { calls.push({ url, opts }); return ok({ request_id: 'r1' }); },
  });

  const res = await client.submit('higgsfield-ai/soul/standard', { prompt: 'a warm room' });

  assert.equal(res.request_id, 'r1');
  assert.equal(calls[0].url, `${BASE_URL}/higgsfield-ai/soul/standard`);
  assert.equal(calls[0].opts.method, 'POST');
  assert.equal(calls[0].opts.headers.Authorization, 'Key k:s');
  assert.deepEqual(JSON.parse(calls[0].opts.body), { prompt: 'a warm room' });
});

test('status GETs the request status path', async () => {
  const calls = [];
  const client = createClient({
    authHeader: 'Key k:s',
    fetchImpl: async (url) => { calls.push(url); return ok({ status: 'queued' }); },
  });

  const res = await client.status('r1');

  assert.equal(res.status, 'queued');
  assert.equal(calls[0], `${BASE_URL}/requests/r1/status`);
});

test('waitFor polls until completed', async () => {
  const sequence = ['queued', 'in_progress', 'completed'];
  let i = 0;
  const client = createClient({
    authHeader: 'Key k:s',
    fetchImpl: async () => ok({ status: sequence[i++], request_id: 'r1' }),
  });

  const res = await client.waitFor('r1', { sleep: noSleep });

  assert.equal(res.status, 'completed');
  assert.equal(i, 3);
});

test('waitFor throws on failed and on nsfw', async () => {
  for (const bad of ['failed', 'nsfw']) {
    const client = createClient({
      authHeader: 'Key k:s',
      fetchImpl: async () => ok({ status: bad }),
    });
    await assert.rejects(
      () => client.waitFor('r1', { sleep: noSleep }),
      (err) => err.message.includes(bad),
    );
  }
});

test('waitFor times out rather than polling forever', async () => {
  const client = createClient({
    authHeader: 'Key k:s',
    fetchImpl: async () => ok({ status: 'in_progress' }),
  });

  await assert.rejects(
    () => client.waitFor('r1', { sleep: noSleep, timeoutMs: 0 }),
    (err) => err.message.includes('timed out'),
  );
});

test('a failed HTTP response never leaks the auth header', async () => {
  const client = createClient({
    authHeader: 'Key leaky-key:leaky-secret',
    fetchImpl: async () => ({ ok: false, status: 401, json: async () => ({}) }),
  });

  await assert.rejects(
    () => client.submit('higgsfield-ai/soul/standard', {}),
    (err) => err.message.includes('401') && !err.message.includes('leaky-secret'),
  );
});
