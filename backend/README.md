# VINCU Backend (MVP)

Node.js + Express + Sequelize + PostgreSQL backend for VINCU Loyalty MVP.

## Requirements

- Node 18+
- PostgreSQL database (local or Neon)

## Setup

1. Install deps:

```bash
npm install
```

2. Create your env file:

```bash
cp .env.example .env
```

3. Edit `.env` and set at least:

- `JWT_SECRET`
- `DATABASE_URL`
- `CORS_ORIGIN` (your frontend URL, default Vite: http://localhost:5173)

4. Run:

```bash
npm run dev
```

Server runs on `http://localhost:4000` and API base is `http://localhost:4000/api`.

> In development, the server uses `sequelize.sync({ alter: true })` to update tables.

## Google Wallet (optional)

If you want to enable pass issuance:

1. Set `GOOGLE_WALLET_ENABLED=true`
2. Set:
   - `GOOGLE_WALLET_ISSUER_ID`
   - `GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_WALLET_PRIVATE_KEY`

Endpoints:

- `GET /api/wallet/add-link/:customerId`
- `POST /api/wallet/sync-customer/:customerId`

## Main endpoints

Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Business
- `GET /api/business/me`
- `PUT /api/business/me`

Customers
- `GET /api/customers?search=`
- `GET /api/customers/:id`
- `GET /api/customers/:id/balance`
- `POST /api/customers`
- `POST /api/customers/find-or-create`
- `POST /api/customers/by-qr`

Products
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`

Rewards
- `GET /api/rewards`
- `POST /api/rewards`
- `PUT /api/rewards/:id`

Orders
- `POST /api/orders`
- `GET /api/orders?customerId=`
- `POST /api/orders/quick-add`

Redemptions
- `POST /api/redemptions`
- `GET /api/redemptions?customerId=`

Movements
- `GET /api/movements?customerId=`

Reports
- `GET /api/reports/summary`
- `GET /api/reports/top-customers`
- `GET /api/reports/rewards-usage`
