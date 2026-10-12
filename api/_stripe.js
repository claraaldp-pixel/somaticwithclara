const crypto = require('crypto');
const STRIPE_API = 'https://api.stripe.com/v1';

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

async function stripeRequest(path, params, idempotencyKey) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error('STRIPE_SECRET_KEY is not configured.');
  const response = await fetch(`${STRIPE_API}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/x-www-form-urlencoded', ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}) },
    body: new URLSearchParams(params).toString()
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body?.error?.message || 'Stripe could not process this request.');
  return body;
}

async function readRawBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === 'string') return Buffer.from(req.body);
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

function verifyStripeSignature(payload, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;
  const signatures = signatureHeader.split(',').reduce((result, part) => {
    const [key, value] = part.split('=');
    if (key === 'v1' && value) result.v1.push(value);
    else if (key === 't' && value) result.t = value;
    return result;
  }, { v1: [] });
  if (!signatures.t || signatures.v1.length === 0) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${signatures.t}.${payload.toString('utf8')}`).digest('hex');
  const calculated = Buffer.from(expected, 'hex');
  const hasValidSignature = signatures.v1.some((signature) => {
    const received = Buffer.from(signature, 'hex');
    return received.length === calculated.length && crypto.timingSafeEqual(received, calculated);
  });
  return hasValidSignature && Math.abs(Math.floor(Date.now() / 1000) - Number(signatures.t)) <= 300;
}

module.exports = { json, readRawBody, stripeRequest, verifyStripeSignature };
