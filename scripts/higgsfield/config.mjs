import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = dirname(dirname(fileURLToPath(new URL('.', import.meta.url))));
export const SOURCE_DIR = join(ROOT, 'scripts', 'higgsfield', 'out', 'source');
export const FRAMES_DIR = join(ROOT, 'scripts', 'higgsfield', 'out', 'frames');
export const OUT_DIR = join(ROOT, 'brand-assets', 'generated');

/** Live site palette — from brand.css. Do not use clara-ember-brand-CURRENT.md, it is stale. */
export const PALETTE = Object.freeze({
  bg: '#F6F1E7',
  cream: '#FBF5EA',
  panel: '#E7DAC9',
  sand: '#EFE7D8',
  clay: '#C89574',
  clayDark: '#B0774F',
  clayDeep: '#C08A66',
  text: '#2A2117',
  body: '#4A3E2F',
  muted: '#6E6051',
  appLilac: '#9b8ec4',
});

const REQUIRED_VARS = ['HIGGSFIELD_API_KEY', 'HIGGSFIELD_API_SECRET'];

/**
 * Builds the Higgsfield auth header from environment variables.
 * Never logs or embeds credential values in error messages.
 */
export function loadConfig(env = process.env) {
  const missing = REQUIRED_VARS.filter((name) => !env[name]);
  if (missing.length > 0) {
    throw new Error(
      `Higgsfield config: Missing required environment variable(s): ${missing.join(', ')}. ` +
      `Add them to .env — see .env.example for the expected names.`,
    );
  }
  return { authHeader: `Key ${env.HIGGSFIELD_API_KEY}:${env.HIGGSFIELD_API_SECRET}` };
}
