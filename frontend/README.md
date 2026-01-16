# VINCU Frontend (Vite + React)

## Setup
1. Copy env:
```bash
cp .env.example .env
```

2. Install & run:
```bash
npm install
npm run dev
```

## Environment
- `VITE_API_URL` should point to the backend API base URL, including `/api`.
  - Example: `http://localhost:4000/api`

## Routes
Public:
- `/` Home
- `/login`
- `/register`

Private:
- `/app/dashboard`
- `/app/pos` (QR scanner + quick +1 point + orders + redemptions)
- `/app/customers`
- `/app/products`
- `/app/rewards`
- `/app/redemptions`
- `/app/reports`
