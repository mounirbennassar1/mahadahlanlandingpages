# Online payments (noon)

Every landing page and the offers page carry two calls to action: **pay** and
**ask on WhatsApp**. Paying opens a checkout sheet, sends the visitor to noon's
hosted payment page, and brings them back to `/checkout/<reference>`.

## Setup

Set these on the server (Vercel project settings, or `.env.local` in dev):

| Variable | Where it comes from |
|---|---|
| `NOON_BUSINESS_ID` | noon dashboard, Business identifier |
| `NOON_APP_ID` | noon dashboard, Application identifier |
| `NOON_APP_KEY` | noon dashboard, Application key (secret) |
| `NOON_ENV` | `test` (sandbox) or `live` |
| `NOON_REGION` | `sa` (default, Saudi Arabia), `eg` or `global`. noon runs one platform per region; the wrong one answers "Organization ... does not exists" |
| `NOON_ORDER_CATEGORY` | optional, the order category configured in noon, default `pay` |
| `NOON_WEBHOOK_SECRET` | optional, the secret set on the webhook in noon |
| `NOON_PUBLIC_KEY` | optional, the merchant RSA public key (PEM on one line with `\n`); stored and shown in Settings, not used by hosted checkout |

Then in the noon dashboard register the webhook URL
`https://www.mahadahlan.com/api/noon/webhook`.

The "Public key" block noon shows (RSA modulus and exponent 65537) is only for
merchants that encrypt card numbers themselves. Hosted checkout never sees card
data, so it is not used here.

`/dashboard/settings` shows whether the variables are present and which
environment is active.

### noon portal checklist

- **Region:** the clinic's account is on noon's Saudi platform, so the API host
  is `api-test.sa.noonpayments.com` (test) / `api.sa.noonpayments.com` (live).
- **Header:** `Authorization: Key base64(business.application:applicationKey)`.
- **Application roles** (Account Settings → Applications → edit the app): the
  app needs **Advanced Integrator** to create orders through the API; without
  it `INITIATE` answers `1505 You are not authorized for the requested action`.
  Add **Refund Manager** for refunds from the dashboard.
- **Order category and channel** must match what noon configured for the
  account (`NOON_ORDER_CATEGORY`, channel `web`); a wrong one has its own error.

## What is sold

- **Packages** (`/dashboard/packages`, and the Packages tab of each landing in
  `/dashboard/pages`) are priced treatments attached to one landing, or to
  every landing when "Every page" is chosen. A page's pay button lists its own
  packages first, then the global ones. A page with no packages at all shows a
  WhatsApp fallback instead of a price list.
- **Offers** (`/dashboard/content/offers`) are what the offers page sells.

Prices are whole riyals and always come from the database, never from the
browser.

## Flow

1. `PayButton` opens `CheckoutSheet` (`components/checkout/`). The visitor
   picks a package, enters name, mobile and city.
2. `POST /api/checkout` creates a **Lead** (so the sales team sees the customer
   even if they abandon) and an **Order** with a reference such as
   `MD-K7Q2-9X4M`, calls noon `INITIATE`, and returns the hosted checkout URL.
3. After paying, noon redirects to `/checkout/<reference>`. The page re-reads
   the order from noon (`GET /order/{id}`), updates the status, shows the
   result, and fires the page's Google Ads conversion on success.
4. noon also POSTs to `/api/noon/webhook`. The payload is only used to find the
   order; the status is always re-read from noon's API, so a forged call can at
   most trigger a refresh. With `NOON_WEBHOOK_SECRET` set the HMAC-SHA512
   signature is verified as well.
5. A paid order moves its lead to **Confirmed** and adds a payment entry on the
   lead's timeline.

Order statuses: `PENDING`, `PAID`, `FAILED`, `CANCELLED`, `EXPIRED`,
`REFUNDED`. `lib/noon.ts` maps noon's own statuses onto these.

## Dashboard

- `/dashboard/orders`: revenue tiles, filters by status, page and date, CSV
  export, and a detail page per order with the full event history.
- Order detail actions: **Check with noon** (any role), **Refund** (ADMIN,
  through noon's `REFUND` operation), notes.
- Each landing's page in `/dashboard/pages` has Packages and Orders tabs.

## Code map

```
lib/noon.ts                   noon API client, status mapping, webhook signature
lib/orders.ts                 sellable items, createCheckout, syncOrderWithNoon, refunds
lib/checkout-types.ts         client-safe types
components/checkout/          CheckoutProvider, CheckoutSheet, CheckoutForm, CheckoutPanel, PayButton
app/api/checkout/             open a checkout, poll a status
app/api/noon/webhook/         noon notifications
app/(site)/checkout/[ref]/    return page
app/(panel)/dashboard/orders  orders list + detail
app/(panel)/dashboard/packages packages CRUD
```

## Adding the pay button to a landing

```tsx
// page.tsx (server)
const items = await getSellableItems(MY_PAGE.slug);
<CheckoutProvider items={items} page={{ slug, title, path }} whatsappTopic="…">
  <Landing content={content} />
</CheckoutProvider>

// inside the landing (client)
<PayButton className="my-gold-button" />            // opens the sheet
<CheckoutPanel theme="light" />                     // inline, where the lead form was
```

## Testing without noon credentials

With the `NOON_*` variables empty the checkout API records the lead and the
order (status `FAILED`, reason "not configured") and the sheet shows the
WhatsApp fallback. With sandbox credentials and `NOON_ENV=test`, use noon's
test cards; nothing is charged.
