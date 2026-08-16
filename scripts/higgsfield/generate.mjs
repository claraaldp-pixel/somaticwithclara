import { mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { loadConfig, OUT_DIR } from './config.mjs';
import { createClient } from './client.mjs';
import { loadManifest } from './manifest.mjs';

export function parseArgs(argv) {
  const onlyIndex = argv.indexOf('--only');
  // The token after --only is its value, not a positional — skip it, or a
  // flags-first invocation would mistake the shot id for the manifest path.
  const skip = onlyIndex === -1 ? -1 : onlyIndex + 1;
  const positional = argv.filter((a, i) => !a.startsWith('--') && i !== skip);

  let onlyInvalid = false;
  let only = null;

  if (onlyIndex !== -1) {
    const value = argv[onlyIndex + 1];
    if (!value || value.startsWith('--')) {
      onlyInvalid = true;
    } else {
      only = value;
    }
  }

  return {
    manifestPath: positional[0] ?? 'scripts/higgsfield/shots.json',
    confirm: argv.includes('--confirm'),
    only,
    onlyInvalid,
  };
}

export function buildRequestBody(shot) {
  const body = { prompt: shot.prompt, ...(shot.params ?? {}) };
  if (shot.type === 'image-to-video') body.image_url = shot.imageUrl;
  return body;
}

/** Picks the first downloadable asset URL out of a completed status payload. */
function resultUrl(status) {
  return status.video?.url ?? status.images?.[0]?.url ?? null;
}

export async function main(argv = process.argv.slice(2), deps = {}) {
  const { load = loadManifest, makeClient = createClient, getConfig = loadConfig } = deps;
  const { manifestPath, confirm, only, onlyInvalid } = parseArgs(argv);

  if (onlyInvalid) {
    console.error('--only requires a value, e.g., --only shot-id');
    process.exit(1);
  }

  const shots = load(manifestPath)
    .filter((shot) => (only ? shot.id === only : true));

  if (shots.length === 0) {
    console.error(only ? `No shot with id "${only}" in ${manifestPath}` : `No shots in ${manifestPath}`);
    process.exit(1);
  }

  console.log(`Manifest: ${manifestPath}`);
  for (const shot of shots) console.log(`  ${shot.id}  ${shot.type}  ${shot.model}`);
  console.log(`\n${shots.length} generation(s) would be submitted. This costs Higgsfield credits.`);

  if (!confirm) {
    console.log('Dry run — nothing submitted. Re-run with --confirm to actually generate.');
    return;
  }

  const { authHeader } = getConfig();
  const client = makeClient({ authHeader });
  mkdirSync(OUT_DIR, { recursive: true });

  for (const shot of shots) {
    console.log(`\n[${shot.id}] submitting…`);
    const submitted = await client.submit(shot.model, buildRequestBody(shot));
    const requestId = submitted.request_id ?? submitted.id;
    console.log(`[${shot.id}] request ${requestId} — polling`);

    const status = await client.waitFor(requestId);
    const url = resultUrl(status);
    if (!url) {
      console.error(`[${shot.id}] completed but returned no downloadable asset`);
      process.exitCode = 1;
      continue;
    }

    const ext = extname(new URL(url).pathname) || (shot.type === 'image-to-video' ? '.mp4' : '.png');
    const dest = join(OUT_DIR, `${shot.id}${ext}`);
    await client.download(url, dest);
    console.log(`[${shot.id}] saved ${dest}`);
  }
}

// Only run the CLI when executed directly, so tests can import safely.
if (process.argv[1]?.endsWith('generate.mjs')) {
  await main();
}
