# ADPULSE Business OS

This repository was previously a documentation-only project. The first production-grade step is now an operational MVP built from scratch in the existing repository: modern landing page, registration and sign-in, tenant-based business setup, pricing/trial flow, client dashboard and internal admin panel.

## Stack

- Node.js 18+
- Express.js
- JWT auth
- JSON persistence (MVP-friendly, replaceable with DB later)
- Vanilla HTML + CSS + JavaScript frontend

## Features included

- Premium landing page in Spanish and English
- Functional language selector
- Sign up / sign in
- Multi-tenant company model
- Basic RBAC and tenant isolation
- Dashboard for business owner
- Internal admin overview
- Trial workflow and acceptance flow
- Audit logging
- Pricing and FAQ sections
- Legal pages for privacy and terms
- Persistence in `data/db.json`

## Run locally

```bash
npm install
npm run dev
```

Then visit:

- http://localhost:3000

## Test

```bash
npm test
```

## Important note

This is a real MVP foundation, not a production certification. It is designed to implement the product flow described in the ADPULSE dossier while keeping the repository honest and operational.
