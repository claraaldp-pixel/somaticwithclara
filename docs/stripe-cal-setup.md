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
| Get Unstuck payment plan | Recurring monthly | £152 (3 payments; £456 total) |
| Reclaim Your Life | One-time | £840 |
| Reclaim Your Life payment plan | Recurring monthly | £142 (6 payments; £852 total) |

The upfront and payment-plan amounts are two stated prices; the difference is not automatically interest. Before enabling the plans in live mode, confirm how the actual client agreement is classified under UK consumer-credit rules. If it is an instalment credit agreement, the FCA's short-term supplier exemption requires no interest or other charges, and its definition of cash price takes generally available upfront discounts into account: https://www.fca.org.uk/firms/authorisation/apply/exemptions-exclusions and https://www.legislation.gov.uk/uksi/2010/1013/regulation/1.

Clara's intended agreement is for the full 3- or 6-month coaching package when the client enrols; the monthly payments spread that package price. Requests to end early will be discussed case by case. Before launch, the checkout terms must explain the commitment, how an early-ending request affects remaining payments, and the client's statutory cancellation rights. In particular, UK online service contracts generally have a 14-day cancellation period, with proportionate payment for services supplied during that period only where the customer expressly requested an early start: https://www.legislation.gov.uk/uksi/2013/3134/part/3.

Copy the four `price_...` IDs. Use **test mode** first.

## Add Vercel environment variables

In Vercel: **Project → Settings → Environment Variables**, add these variables to **Preview** for sandbox testing. The Stripe key and all four price IDs must come from the same Stripe sandbox. Add matching live values to **Production** only after the preview checkout and fixed schedules are confirmed.

```text
STRIPE_SECRET_KEY=sk_...
STRIPE_GET_UNSTUCK_FULL_PRICE_ID=price_...
STRIPE_GET_UNSTUCK_PLAN_PRICE_ID=price_...
STRIPE_RECLAIM_FULL_PRICE_ID=price_...
STRIPE_RECLAIM_PLAN_PRICE_ID=price_...
CAL_FIRST_SESSION_URL=https://cal.com/.../...
```

Leave `SITE_URL` unset in Preview so cancelled checkouts return to the preview site's own address. For Production, set `SITE_URL=https://www.somaticwithclara.com`. Do not put any secret values into an HTML file, a Git commit, or a public message. Vercel applies new variables only to new deployments, so deploy or redeploy after saving them.

## Add the Stripe webhook

After a **Preview** deployment with the variables above:

1. In the Stripe sandbox, open **Workbench → Webhooks → Create an event destination**.
2. Choose **Your account** and the **Snapshot** payload format. This site's handler reads `event.data.object`; a Thin payload will not work.
3. Select only the event `checkout.session.completed`, then choose **Webhook endpoint**.
4. Enter `https://YOUR-PREVIEW-DOMAIN/api/stripe-webhook` as the endpoint URL (use the actual publicly accessible Preview deployment URL).
5. Reveal and copy the signing secret beginning `whsec_...`.
6. Add it to Vercel Preview as `STRIPE_WEBHOOK_SECRET`, then redeploy the Preview deployment.

### Protected Preview deployments

If the Preview URL redirects an unauthenticated visitor to Vercel login, Stripe cannot deliver the webhook to the plain URL above. Keep Preview protection on and use Vercel's **Settings → Deployment Protection → Protection Bypass for Automation**. Create a dedicated bypass secret for this sandbox test; do not share it in chat or commit it. Edit the Stripe sandbox webhook destination to append `?x-vercel-protection-bypass=YOUR_BYPASS_SECRET` to the same Preview webhook URL. Stripe still signs each event, and `STRIPE_WEBHOOK_SECRET` must remain configured separately. A bypass secret grants access to protected deployments in this Vercel project, so keep its URL private and revoke the dedicated secret when sandbox testing is finished. If you redeploy after creating or rotating the secret, update the Stripe destination to the new Preview deployment URL.

Vercel documents this query-parameter method specifically for third-party webhooks: https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation.

For launch, create a separate live-mode Stripe webhook pointing to `https://www.somaticwithclara.com/api/stripe-webhook` and put its own signing secret in Vercel Production. Do not reuse the sandbox webhook secret.

The webhook uses Stripe idempotency keys, so a retry cannot create duplicate schedules. It converts the current subscription phase into either 3 or 6 iterations and sets `end_behavior` to `cancel`.

## Test before going live

1. Keep Stripe in test mode and place one test order for each instalment option.
2. Confirm that Stripe displays a subscription schedule with 3 or 6 monthly iterations and an end behavior of **cancel**.
3. Confirm that the success redirect opens the intended Cal.com first-session event.
4. Confirm the card buttons on `/offers` work on desktop and mobile.
5. Repeat in live mode only after the test result is correct.

## Cal.com settings

Create a 60-minute event for paid 1:1 clients. Set it to show only the next 90 days, add the 24-hour rescheduling/cancellation cutoff, and use this event URL as `CAL_FIRST_SESSION_URL`. Send your ongoing-client booking link after the first session, so clients can book further ahead only as your calendar opens.
