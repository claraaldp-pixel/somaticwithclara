import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = dirname(dirname(fileURLToPath(new URL('.', import.meta.url))));
export const SOURCE_DIR = join(ROOT, 'scripts', 'higgsfield', 'out', 'source');
export const FRAMES_DIR = join(ROOT, 'scripts', 'higgsfield', 'out', 'frames');
export const OUT_DIR = join(ROOT, 'brand-assets', 'generated');

/** Current Somatic with Clara palette — mirrored from brand.css. */
export const PALETTE = Object.freeze({
  paper: '#FFF0DC',
  paperLight: '#FFFAF3',
  paperDeep: '#F3DFBF',
  ink: '#241C15',
  navy: '#2E4B68',
  teal: '#3F7975',
  orange: '#F35F32',
  plum: '#813B72',
  mustard: '#F8B52C',
  pink: '#E94F73',
  peacock: '#4D91A1',
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
