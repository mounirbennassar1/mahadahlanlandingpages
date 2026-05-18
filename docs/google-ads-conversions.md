# Google Ads — Conversions to Create

Create **20 conversion actions** in your Google Ads account, one per row below.
After each is created, copy the snippet Google gives you and paste the two
parts into `/dashboard/conversions` in the panel.

---

## Once per account — shared settings

Sign in to [Google Ads](https://ads.google.com) → **Goals → Conversions → Summary → + New conversion action → Website**.

Use these settings for **every** row in the table below:

| Setting | Value |
| --- | --- |
| Goal & action optimization | **Submit lead form** (Google groups all 20 under the Lead goal so Smart Bidding can optimize them together) |
| Value | **Don't use a value** |
| Count | **One** (counts at most one conversion per click/submit, avoids inflated counts when someone taps WhatsApp 3× in a row) |
| Click-through window | **30 days** |
| Engaged-view window | **Off** |
| View-through window | **1 day** (default) |
| Attribution model | **Data-driven** (default) |
| Include in "Conversions" | **Yes** (so Smart Bidding optimizes for them) |

Naming convention used below: **`MahaDahlan – <Landing> – <Event>`** — keep this format so the Conversions report sorts cleanly.

---

## The 20 conversions

The **Trigger** column tells you which option to pick in Google Ads → "How
should the conversion be counted" → **"Click"** vs **"Page load"**:

- **🖱 Click** — fires the moment the user does something (clicks WhatsApp, clicks Submit). The page they're on stays the same. Used for WhatsApp + inline-success forms.
- **📄 Page load** — fires when a specific URL (a thank-you page) finishes loading. Used for forms that redirect after submit.

| # | Conversion name | Landing slug | Event | Trigger | Fires when | Has form today? |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `MahaDahlan – Acne – WhatsApp Click` | `acne` | WhatsApp | 🖱 **Click** | User clicks any `wa.me` link on `/acne` | — |
| 2 | `MahaDahlan – Acne – Form Submit` | `acne` | Form | 🖱 **Click** | Form submit success on `/acne` | ❌ no form yet |
| 3 | `MahaDahlan – Body – WhatsApp Click` | `body` | WhatsApp | 🖱 **Click** | User clicks any `wa.me` link on `/body` | — |
| 4 | `MahaDahlan – Body – Form Submit` | `body` | Form | 📄 **Page load** | `/body/thank-you` page loads after submit | ✅ |
| 5 | `MahaDahlan – Botox – WhatsApp Click` | `botox` | WhatsApp | 🖱 **Click** | User clicks any `wa.me` link on `/botox` | — |
| 6 | `MahaDahlan – Botox – Form Submit` | `botox` | Form | 🖱 **Click** | Inline BookingForm success on `/botox` (no redirect) | ✅ |
| 7 | `MahaDahlan – Dark Circles – WhatsApp Click` | `dark-circles` | WhatsApp | 🖱 **Click** | User clicks any `wa.me` link on `/dark-circles` | — |
| 8 | `MahaDahlan – Dark Circles – Form Submit` | `dark-circles` | Form | 🖱 **Click** | LeadForm success on `/dark-circles` (no redirect) | ✅ |
| 9 | `MahaDahlan – Facial – WhatsApp Click` | `facial` | WhatsApp | 🖱 **Click** | User clicks any `wa.me` link on `/facial` | — |
| 10 | `MahaDahlan – Facial – Form Submit` | `facial` | Form | 🖱 **Click** | Form submit success on `/facial` | ❌ no form yet |
| 11 | `MahaDahlan – Hair – WhatsApp Click` | `hair` | WhatsApp | 🖱 **Click** | User clicks any `wa.me` link on `/hair` | — |
| 12 | `MahaDahlan – Hair – Form Submit` | `hair` | Form | 📄 **Page load** | `/hair/thank-you` page loads after submit | ✅ |
| 13 | `MahaDahlan – Hyperpigmentation – WhatsApp Click` | `hyperpigmentation` | WhatsApp | 🖱 **Click** | User clicks any `wa.me` link on `/hyperpigmentation` | — |
| 14 | `MahaDahlan – Hyperpigmentation – Form Submit` | `hyperpigmentation` | Form | 🖱 **Click** | ContactForm success on `/hyperpigmentation` (no redirect) | ✅ |
| 15 | `MahaDahlan – Stretchmarks – WhatsApp Click` | `stretchmarks` | WhatsApp | 🖱 **Click** | User clicks any `wa.me` link on `/stretchmarks` | — |
| 16 | `MahaDahlan – Stretchmarks – Form Submit` | `stretchmarks` | Form | 🖱 **Click** | Form submit success on `/stretchmarks` | ❌ no form yet |
| 17 | `MahaDahlan – Sample – WhatsApp Click` | `sample` | WhatsApp | 🖱 **Click** | User clicks any `wa.me` link on `/sample` | — |
| 18 | `MahaDahlan – Sample – Form Submit` | `sample` | Form | 🖱 **Click** | Form submit success on `/sample` | depends on demo |
| 19 | `MahaDahlan – Microneedling RF – WhatsApp Click` | `microneedling-rf` | WhatsApp | 🖱 **Click** | User clicks any `wa.me` link on `/microneedling-rf` (hero CTA, sticky mobile bar, floating FAB, booking section, success state) | ✅ |
| 20 | `MahaDahlan – Microneedling RF – Form Submit` | `microneedling-rf` | Form | 🖱 **Click** | Inline LeadForm success on `/microneedling-rf` (no redirect) | ✅ |

### Quick summary by trigger type

- **🖱 18 Click-based** — all 10 WhatsApp + 8 inline-success Form conversions
- **📄 2 Page-load-based** — `Body – Form Submit` (fires on `/body/thank-you`) and `Hair – Form Submit` (fires on `/hair/thank-you`)

### Important note on choosing the trigger in Google Ads

Even though our code fires **all** conversions via `gtag('event', 'conversion', ...)` (which is technically the "Click" pattern for both kinds), you should still tell Google Ads the *semantic* trigger type so reporting and attribution are accurate:

- For the **2 page-load rows** (#4 Body Form, #12 Hair Form): the snippet still works either way, but we recommend you pick **"Page load"** in the Google Ads UI. Google's UI uses this to display a clearer report ("fired on /body/thank-you").
- For the **other 18**: pick **"Click"**.

Both are wired identically in our code — the choice only affects how Google Ads displays it, not whether it fires.

### About the "no form yet" rows

Acne, Facial, Stretchmarks, and possibly Sample don't currently have a form — they drive only WhatsApp. You have two options:

- **Skip** creating those 4 Form conversions for now → only build 16. If/when you add a form to those pages, come back and create the conversion then.
- **Create all 20 anyway** → the DB row already exists (auto-seeded), it just won't fire any events until a form is added. Zero harm; future-proof.

Recommendation: **create all 20**. Cheaper to do it once.

---

## After creating each conversion — paste it into the dashboard

1. In Google Ads, after saving the conversion action, click **"See event snippet"**. You'll see something like:

   ```html
   <!-- Event snippet for MahaDahlan – Acne – WhatsApp Click conversion page -->
   <script>
     gtag('event', 'conversion', {
       'send_to': 'AW-10989762778/abcDEF123ghi'
     });
   </script>
   ```

2. Open **`/dashboard/conversions`** in the panel (you must be ADMIN).

3. Find the matching row (e.g. **Acne → WhatsApp Click**) and paste:

   | Field in dashboard | What to paste | From the example above |
   | --- | --- | --- |
   | **Conversion ID** | The part **before** the slash in `send_to` | `AW-10989762778` |
   | **Label** | The part **after** the slash in `send_to` | `abcDEF123ghi` |
   | **Active** | ✅ checked | |

4. Click **Save**. Done — that conversion now fires live.

You can leave any row blank — it simply won't fire until you fill it in. So there's no harm in saving them one at a time as you create them in Google Ads.

---

## Verifying it works

After pasting an ID into the dashboard, verify the conversion actually fires:

1. Install Google's [Tag Assistant](https://tagassistant.google.com) Chrome extension.
2. Connect Tag Assistant to your domain (`mahadahlan.com` and the relevant subdomains/landings).
3. Visit the landing (e.g. `/acne`) → click a WhatsApp button.
4. In Tag Assistant you should see a **`conversion`** event firing with the matching `send_to` value.
5. Within ~3 hours, the conversion will also appear in Google Ads → Goals → Conversions → with status **"Recording conversions"**.

If the event fires in Tag Assistant but Google Ads stays at "No recent conversions" after 24 hours, double-check that the `AW-NNN/label` matches exactly — typos are the #1 cause.

---

## What's not tracked (and why)

- **No conversion value** is sent (per setup choice). Smart Bidding will use "Maximize Conversions" not "Maximize Conversion Value". When you have LTV data later, add values directly in the Google Ads UI per conversion action — no code change needed.
- **No iOS / ad-blocker recovery** (per setup choice). About 30–40% of clicks on iOS Safari or with strict ad blockers won't be recorded. To recover those, upgrade to server-side conversion import via the Google Ads API later — the DB schema already supports it.
- **WhatsApp click ≠ WhatsApp conversation**. We track the click; we can't track whether the user actually sent a message inside WhatsApp. For that, you'd need WhatsApp Business API click-to-chat tracking, which is a separate project.

---

## How this connects to the code

Quick reference for anyone reading later:

| Concern | File |
| --- | --- |
| Database model | `prisma/schema.prisma` (`ConversionAction`, `ConversionType`) |
| Auto-seed on first lead | `lib/sources.ts:ensureConversionActionsForSource` |
| Server-side config loader | `lib/conversions.ts:getConversionsForSlug` |
| Client gtag fire | `lib/gtag.ts:fireConversion` |
| Layout injection + WhatsApp listener | `components/landing/ConversionTracking.tsx` |
| Thank-you page form fire | `components/landing/FireFormConversion.tsx` |
| Dashboard UI | `app/(panel)/dashboard/conversions/page.tsx` |
| Save action | `app/(panel)/dashboard/conversions/actions.ts` |

Adding a new landing? Drop `<ConversionTracking slug="new-slug" />` into its layout. On the first lead submission, the source + conversion rows auto-create — go to `/dashboard/conversions` and fill them in.
