const { json, stripeRequest } = require('./_stripe');

const OFFERS = {
  'get-unstuck-full': { mode: 'payment', priceEnv: 'STRIPE_GET_UNSTUCK_FULL_PRICE_ID', cancelAnchor: 'get-unstuck' },
  'get-unstuck-plan': { mode: 'subscription', priceEnv: 'STRIPE_GET_UNSTUCK_PLAN_PRICE_ID', installments: 3, cancelAnchor: 'get-unstuck' },
  'reclaim-full': { mode: 'payment', priceEnv: 'STRIPE_RECLAIM_FULL_PRICE_ID', cancelAnchor: 'reclaim' },
  'reclaim-plan': { mode: 'subscription', priceEnv: 'STRIPE_RECLAIM_PLAN_PRICE_ID', installments: 6, cancelAnchor: 'reclaim' }
};

function siteUrl(req) {
  return (process.env.SITE_URL || `https://${req.headers.host}`).replace(/\/$/, '');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });
  const { offer: offerKey } = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const offer = OFFERS[offerKey];
  const priceId = offer && process.env[offer.priceEnv];
  const firstSessionUrl = process.env.CAL_FIRST_SESSION_URL;
  if (!offer || !priceId || !firstSessionUrl) {
    console.error('Checkout is missing an offer, Stripe price, or Cal.com URL.', { offerKey });
    return json(res, 500, { error: 'Checkout is not configured yet.' });
  }

  const params = { mode: offer.mode, 'line_items[0][price]': priceId, 'line_items[0][quantity]': '1', success_url: firstSessionUrl, cancel_url: `${siteUrl(req)}/offers#${offer.cancelAnchor}`, 'metadata[somatic_offer]': offerKey };
  if (offer.mode === 'payment') params.customer_creation = 'always';
  else {
    params['subscription_data[metadata][somatic_offer]'] = offerKey;
    params['subscription_data[metadata][installments]'] = String(offer.installments);
  }

  try {
    const session = await stripeRequest('/checkout/sessions', params);
    return json(res, 200, { url: session.url });
  } catch (error) {
    console.error('Unable to create Stripe Checkout session:', error.message);
    return json(res, 500, { error: 'Checkout could not be started.' });
  }
};
