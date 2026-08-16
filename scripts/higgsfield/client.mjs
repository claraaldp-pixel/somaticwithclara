import { writeFile } from 'node:fs/promises';

export const BASE_URL = 'https://platform.higgsfield.ai';

const TERMINAL_FAILURES = new Set(['failed', 'nsfw']);

/**
 * Higgsfield API client.
 * `fetchImpl` is injectable so tests never hit the network or spend credits.
 * Error messages deliberately exclude the auth header.
 */
export function createClient({ authHeader, fetchImpl = fetch, baseUrl = BASE_URL }) {
  async function request(path, options = {}) {
    const res = await fetchImpl(`${baseUrl}${path}`, {
      ...options,
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
    });
    if (!res.ok) {
      throw new Error(`Higgsfield ${options.method ?? 'GET'} ${path} failed with HTTP ${res.status}`);
    }
    return res.json();
  }

  const client = {
    submit(modelId, body) {
      return request(`/${modelId}`, { method: 'POST', body: JSON.stringify(body) });
    },

    status(requestId) {
      return request(`/requests/${requestId}/status`);
    },

    async waitFor(requestId, { intervalMs = 5000, timeoutMs = 600000, sleep } = {}) {
      const wait = sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
      const deadline = Date.now() + timeoutMs;
      do {
        const current = await client.status(requestId);
        if (current.status === 'completed') return current;
        if (TERMINAL_FAILURES.has(current.status)) {
          throw new Error(`Generation ${requestId} ended with status "${current.status}"`);
        }
        await wait(intervalMs);
      } while (Date.now() < deadline);
      throw new Error(`Generation ${requestId} timed out after ${timeoutMs}ms`);
    },

    async download(url, destPath) {
      const res = await fetchImpl(url);
      if (!res.ok) throw new Error(`Download failed with HTTP ${res.status} for ${destPath}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      await writeFile(destPath, buffer);
      return destPath;
    },
  };

  return client;
}
