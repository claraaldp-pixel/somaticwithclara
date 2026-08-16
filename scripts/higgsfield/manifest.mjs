import { readFileSync } from 'node:fs';

const REQUIRED_FIELDS = ['id', 'model', 'type', 'prompt'];
const VALID_TYPES = ['text-to-image', 'image-to-video'];

/**
 * Validates a single shot entry, returning an array of human-readable error strings (empty if valid).
 */
export function validateShot(shot, index) {
  const errors = [];
  const label = `shot[${index}]${shot?.id ? ` (${shot.id})` : ''}`;

  for (const field of REQUIRED_FIELDS) {
    if (!shot?.[field]) errors.push(`${label}: missing required field "${field}"`);
  }
  if (shot?.type && !VALID_TYPES.includes(shot.type)) {
    errors.push(`${label}: "type" must be one of ${VALID_TYPES.join(', ')}`);
  }
  if (shot?.type === 'image-to-video' && !shot.firstFrame) {
    errors.push(`${label}: image-to-video shots require a "firstFrame" path`);
  }
  if (shot?.type === 'image-to-video' && !URL.canParse(shot.imageUrl)) {
    errors.push(`${label}: image-to-video shots require "imageUrl" to be a reachable http(s) URL`);
  }
  return errors;
}

/**
 * Validates a full shot manifest (array of shots), returning an array of human-readable error strings (empty if valid).
 */
export function validateManifest(shots) {
  if (!Array.isArray(shots)) return ['manifest must be an array of shots'];

  const errors = shots.flatMap((shot, i) => validateShot(shot, i));
  const ids = shots.map((s) => s?.id).filter(Boolean);
  const duplicates = new Set(ids.filter((id, i) => ids.indexOf(id) !== i));
  for (const id of duplicates) errors.push(`duplicate shot id: "${id}"`);

  return errors;
}

/**
 * Reads and validates a shot manifest JSON file, returning the parsed shots array.
 * @throws {Error} if the file cannot be parsed or the manifest fails validation.
 */
export function loadManifest(path) {
  const shots = JSON.parse(readFileSync(path, 'utf8'));
  const errors = validateManifest(shots);
  if (errors.length > 0) {
    throw new Error(`Invalid manifest ${path}:\n  ${errors.join('\n  ')}`);
  }
  return shots;
}
