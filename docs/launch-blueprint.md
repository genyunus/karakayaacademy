# Karakayaacademy Launch Blueprint

## Recommended stack

- `Next.js` for the website and app logic
- `Vercel` for hosting and deployments
- `Supabase` for database, auth, and admin-ready storage
- `Stripe` for package sales, memberships, checkout, and customer portal

## Why this stack

- It keeps monthly platform cost close to zero at the beginning.
- It avoids being trapped inside a website builder or GoDaddy-managed tooling.
- It can start simple and still scale into bookings, memberships, and client accounts.
- It is a standard modern stack, so future developers can work on it easily.

## Important reality

- Booking and inquiry flows can be built with no monthly software cost.
- Payments are never truly free because Stripe will always charge transaction fees.
- That is still the best tradeoff for a very small business because there is no large upfront software bill.

## What to launch first

1. Inquiry capture
2. Intro session booking
3. One-time package checkout
4. Recurring membership
5. Member login, booking history, and package balance

## Phase 1 deliverables

- Strong marketing homepage
- Inquiry form saved to database
- Class booking request form saved to database
- Starter packages displayed on the site
- Stripe checkout wiring prepared

## Phase 2 deliverables

- Live Stripe products and price IDs
- Successful payment webhook handling
- Booking confirmation emails
- Admin view of inquiries, bookings, and purchases

## Phase 3 deliverables

- Member authentication with magic link login
- Customer portal for subscription management
- Package balance tracking
- Member dashboard with upcoming bookings

## Wiring checklist

- Create Vercel project
- Create Supabase project
- Run `db/schema.sql`
- Add environment variables from `.env.example`
- Create Stripe products and prices
- Add Stripe price IDs to env vars
- Point GoDaddy domain DNS to Vercel
- Turn on Stripe webhook endpoint after deployment
