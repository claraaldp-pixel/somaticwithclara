# Stripe + Cal.com setup

This site creates Stripe Checkout sessions itself, so secret keys never appear in browser code. Instalment checkouts begin a Stripe subscription, then the Stripe webhook converts it into a schedule with a fixed number of monthly payments.

## What the client experiences

1. They choose a payment option on `/offers`.
2. Stripe collects payment securely.
3. Stripe sends them to the Cal.com first-session booking link.
4. For instalment plans, Stripe automatically stops after the agreed number of payments.

Cal.com does not track used sessions. Keep a private client tracker with: name, package, payment status, sessions used, sessions remaining, and package expiry.

## Create Stripe prices

In Stripe **Product catalogue**, create the following prices in GBP:

| Product | Price type | Amount |
| --- | --- | ---: |
| Get Unstuck | One-time | £450 |
| Get Unstuck payment plan | Recurring monthly | £150 |
| Reclaim Your Life | One-time | £840 |
| Reclaim Your Life payment plan | Recurring monthly | £140 |

Copy the four `price_...` IDs. Use **test mode** first.

## Add Vercel environment variables

In Vercel: **Project → Settings → Environment Variables**, add these variables. Use Stripe **test** values in Preview while testing; add the matching Stripe **live** values to Production only when the test checkout and fixed schedules are confirmed.

```text
STRIPE_SECRET_KEY=sk_...
STRIPE_GET_UNSTUCK_FULL_PRICE_ID=price_...
STRIPE_GET_UNSTUCK_PLAN_PRICE_ID=price_...
STRIPE_RECLAIM_FULL_PRICE_ID=price_...
STRIPE_RECLAIM_PLAN_PRICE_ID=price_...
CAL_FIRST_SESSION_URL=https://cal.com/.../...
SITE_URL=https://www.somaticwithclara.com
```

Do not put any of these values into an HTML file, a Git commit, or a public message.

## Add the Stripe webhook

After a deployment with the variables above:

1. In Stripe, open **Developers → Webhooks → Add endpoint**.
2. Endpoint URL: `https://www.somaticwithclara.com/api/stripe-webhook`.
3. Select the event `checkout.session.completed`.
4. Copy the signing secret beginning `whsec_...`.
5. Add it to Vercel as `STRIPE_WEBHOOK_SECRET`, then redeploy.

The webhook uses Stripe idempotency keys, so a retry cannot create duplicate schedules. It converts the current subscription phase into either 3 or 6 iterations and sets `end_behavior` to `cancel`.

## Test before going live

1. Keep Stripe in test mode and place one test order for each instalment option.
2. Confirm that Stripe displays a subscription schedule with 3 or 6 monthly iterations and an end behavior of **cancel**.
3. Confirm that the success redirect opens the intended Cal.com first-session event.
4. Confirm the card buttons on `/offers` work on desktop and mobile.
5. Repeat in live mode only after the test result is correct.

## Cal.com settings

Create a 60-minute event for paid 1:1 clients. Set it to show only the next 90 days, add the 24-hour rescheduling/cancellation cutoff, and use this event URL as `CAL_FIRST_SESSION_URL`. Send your ongoing-client booking link after the first session, so clients can book further ahead only as your calendar opens.
