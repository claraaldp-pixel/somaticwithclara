const { json, readRawBody, stripeRequest, verifyStripeSignature } = require('./_stripe');

module.exports.config = { api: { bodyParser: false } };

const INSTALLMENT_OFFERS = { 'get-unstuck-plan': 3, 'reclaim-plan': 6 };

async function putSubscriptionOnFixedSchedule(subscriptionId, sessionId, installments) {
  // Checkout has already collected payment one. The schedule retains that
  // current cycle, so its iterations include the first payment.
  const schedule = await stripeRequest('/subscription_schedules', { from_subscription: subscriptionId }, `somatic-schedule-create-${sessionId}`);
  const phase = schedule.phases?.[0];
  const item = phase?.items?.[0];
  if (!phase || !item?.price || !phase.start_date) throw new Error('Stripe returned a schedule without a usable first phase.');

  return stripeRequest(`/subscription_schedules/${schedule.id}`, {
    end_behavior: 'cancel',
    proration_behavior: 'none',
    'phases[0][start_date]': String(phase.start_date),
    'phases[0][iterations]': String(installments),
    'phases[0][items][0][price]': item.price,
    'phases[0][items][0][quantity]': String(item.quantity || 1)
  }, `somatic-schedule-finish-${sessionId}`);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });
  const payload = await readRawBody(req);
  if (!verifyStripeSignature(payload, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET)) return json(res, 400, { error: 'Webhook signature verification failed.' });

  let event;
  try { event = JSON.parse(payload.toString('utf8')); } catch { return json(res, 400, { error: 'Webhook body was not valid JSON.' }); }
  if (event.type !== 'checkout.session.completed') return json(res, 200, { received: true });

  const session = event.data.object;
  const installments = INSTALLMENT_OFFERS[session.metadata?.somatic_offer];
  const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
  if (!installments || !subscriptionId) return json(res, 200, { received: true });

  try {
    const schedule = await putSubscriptionOnFixedSchedule(subscriptionId, session.id, installments);
    console.log(`Created ${installments}-payment schedule ${schedule.id} for Checkout ${session.id}.`);
    return json(res, 200, { received: true });
  } catch (error) {
    // A non-2xx response makes Stripe retry; idempotency keys prevent duplicates.
    console.error(`Could not create schedule for Checkout ${session.id}:`, error.message);
    return json(res, 500, { error: 'Unable to create the payment schedule.' });
  }
};
