# TechCulture Invoice API

Separate module for the **invoice** Next.js app.  
Does **not** modify techculture-backoffice or techculture-ai-user business logic.

## Collections (MongoDB)

| Key | Collection name |
| --- | --- |
| customers | `invoice_customers` |
| invoices | `invoice_invoices` |
| payments | `invoice_payments` |
| settings | `invoice_settings` |

Uses the same `MONGODB_URI` / DB as the backend process, with prefixed collection names so data stays isolated from blogs/jobs/team/admins.

## Base path

`/api/invoice`

### Auth (public)

- `POST /auth/login` — **admin only** (uses shared `admins` collection)
- `GET /auth/me` — validate admin JWT

All other invoice routes require `Authorization: Bearer <token>` with `role: "admin"`.

### Endpoints (admin JWT required)

- `GET /health` (public)
- `GET /dashboard`
- `GET /workspace` — bundle for the invoice UI
- `GET|POST /customers`
- `GET|PUT|PATCH|DELETE /customers/:id`
- `GET|POST /invoices`
- `GET|PUT|PATCH|DELETE /invoices/:id`
- `GET|POST /payments`
- `GET|PUT|PATCH|DELETE /payments/:id`

## Frontend

Set in `invoice/.env.local`:

```env
NEXT_PUBLIC_INVOICE_API_URL=http://localhost:5050/api/invoice
```
