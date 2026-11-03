# API service

Express service on port 4000. The browser calls this API through Vite's `/api` proxy; only the server accesses Fake Store API.

- `GET /api/health`
- `GET /api/products/featured` — top five by rating.
- `GET /api/categories`
- `GET /api/products?q=term&category=category`
- `GET /api/products/:id`
- `POST /api/enquiries` — validates and captures enquiries through EmailProvider.

Configure `PORT` and optionally `WEB_ORIGIN`. The default local inbox is in-memory and resets on restart.
