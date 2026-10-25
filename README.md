# Property Management

A real estate listing website built with Next.js, TypeScript, Payload CMS, and PostgreSQL. Payload's admin dashboard manages property listings, uploaded photos, staff accounts, and customer inquiries.

## Local development

1. Copy `.env.example` to `.env` and set a private `PAYLOAD_SECRET`, a PostgreSQL password, and the database connection string. Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to your business number in international digits-only format to show WhatsApp inquiry links.
2. Create the PostgreSQL database and make sure `DATABASE_URL` points to it. For Docker Compose, the included PostgreSQL service uses the `POSTGRES_*` settings in `.env`.
3. Install packages with `npm ci` and start the app with `npm run dev`.
4. Open `http://localhost:3000/admin` and create the first administrator account.

Do not commit `.env` or put private credentials in `NEXT_PUBLIC_*` variables. Only the WhatsApp business number is intended to be public.

## Managing listings

Use the Payload dashboard at `/admin` to create property records, upload a cover photo and gallery images, set sale or rent details and availability, then publish the listing. Public property pages read published records from Payload. Customer messages appear in the Inquiries collection; only authenticated staff can view or update them.

## Project commands

- `npm run dev` starts Next.js in development mode.
- `npm run generate:types` regenerates Payload's TypeScript types after collection changes.
- `npm run lint` runs ESLint.
- `npx tsc --noEmit` checks TypeScript.
- `npm run build` builds the production app.
