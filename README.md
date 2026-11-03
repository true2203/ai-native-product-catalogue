# AI-Native Product Catalogue

A full-stack product catalogue built around the Fake Store API, with a server-side provider boundary, searchable catalogue, product details, and an enquiry workflow.

## Project status

Initial implementation is being developed on a feature branch and will be submitted through a pull request.

## Planned architecture

- `apps/web`: React + TypeScript single-page application.
- `apps/api`: Node.js + TypeScript + Express API. The browser communicates only with this API; the API proxies the Fake Store API.
- Provider interfaces isolate external product and email services.
- Tests cover API routes and key UI behaviour.

## Requirements

- Node.js 20+
- npm 10+

## Local development

Run `npm install`, then `npm run dev` from the repository root. See package scripts and the API/web READMEs as implementation is added.

## Documentation

- [DECISIONS.md](DECISIONS.md) — architecture and trade-offs.
- [AI_USAGE.md](AI_USAGE.md) — AI assistance and verification.

## Time breakdown

Actual time spent should be recorded by the author during implementation and review; no retrospective estimate is represented as measured time here.
