# Forma — AI-Native Product Catalogue

A responsive product catalogue built with React, TypeScript, Express, and the Fake Store API. The visual direction is an editorial, minimal storefront called **Forma**.

## Features

- Home page with five highest-rated featured products.
- Category navigation, with products sorted by rating.
- Search by product title or description.
- Product detail page with image, price, description, and rating.
- Enquiry form with name, email, phone, and message validation.
- Thank-you state after successful enquiry submission.
- Server-side product provider boundary; the browser never calls Fake Store API directly.
- Email provider boundary: local in-memory capture by default, optional SMTP delivery when configured.

## Architecture

- **apps/web** — React + TypeScript + Vite.
- **apps/api** — Node.js + TypeScript + Express.
- **ProductProvider** — isolates Fake Store API integration.
- **EmailProvider** — isolates email delivery.

See DECISIONS.md for architectural trade-offs, AI_USAGE.md for AI-use disclosure and verification guidance, and TIME_BREAKDOWN.md for the effort record requested by the assignment.

## Requirements

- Node.js 20+
- npm 10+

## Run locally

From the repository root:

```bash
npm install
npm run dev
```

Open the Vite URL printed by the web workspace (normally http://localhost:5173). The API runs on http://localhost:4000. Vite proxies /api requests to the API.

Run checks:

```bash
npm test
npm run typecheck
npm run build
```

## Email configuration

Without SMTP settings, accepted enquiries are captured by the local in-memory provider. This needs no credentials and resets when the API restarts.

To deliver email to a real sales inbox, configure these variables for the API process:

| Variable | Purpose |
| --- | --- |
| SMTP_HOST | SMTP server hostname |
| SMTP_PORT | SMTP port (commonly 587 or 465) |
| SMTP_SECURE | true for implicit TLS (commonly port 465) |
| SMTP_USER | Optional SMTP username |
| SMTP_PASSWORD | Optional SMTP password |
| SMTP_FROM | Sender address |
| SALES_INBOX | Destination sales inbox |

An example file is provided at apps/api/.env.example. Copy it to apps/api/.env or set the variables in your environment. Do not commit credentials. Use a secret manager in deployment. Configure WEB_ORIGIN to restrict API CORS origins outside local development.

## Assignment notes

No paid infrastructure is required for local evaluation. Actual time spent should be recorded in TIME_BREAKDOWN.md; durations are intentionally left blank rather than fabricated.
