# Architecture and Engineering Decisions

## Technology and structure
The project is an npm-workspace monorepo with React + TypeScript + Vite in `apps/web` and Node.js + TypeScript + Express in `apps/api`. Separate applications keep UI and API responsibilities clear while sharing one install and command surface.

## Product integration
The browser calls only the local Express API. The API owns Fake Store API access. A `ProductProvider` interface isolates the upstream source so it can be replaced without changing route consumers. The adapter validates upstream product payloads and applies a request timeout. Catalogue filtering and rating sort occur on the server.

## Featured and category behaviour
The home view selects five products ordered by rating descending, with product ID as deterministic tie-breaker. Category views place the highest-rated products first, followed by remaining products in descending rating order.

## Enquiry integration
An `EmailProvider` boundary decouples form submission from delivery. The default `LocalEmailProvider` captures submissions in memory and logs a simple receipt so the complete flow can be evaluated without paid infrastructure or credentials. The in-memory inbox is ephemeral and is not production persistence.

## Validation and security
Request bodies are bounded and validated with Zod. No keys or secrets are required or committed. Browser traffic goes through the API; the browser never integrates directly with the upstream provider.

## Testing
Vitest and Supertest cover API route behaviour and input validation. Vitest and React Testing Library cover key user-visible flows. Tests favour observable behaviour and provider boundaries.

## Trade-offs and production follow-up
Local enquiries reset on restart. A deployed version should provide durable storage and a real email adapter, plus rate limiting, structured logging/telemetry, stricter deployment CORS configuration, and monitoring of upstream API availability. Local setup requires Node.js 20+ and npm 10+, but no cloud service credentials.
