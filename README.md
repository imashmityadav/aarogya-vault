# Aarogya Vault

Aarogya Vault is a prototype healthcare web platform that supports role-based dashboards (Patient, Doctor, Insurance), medical record uploads, appointment booking, reminders, insurance claims, and AI prediction.

## 🚀 Getting Started

### 1) Install dependencies
```bash
npm install
```

### 2) Create the MySQL database
Update the MySQL credentials in `server.js` or set environment variables (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).

Then run:
```bash
mysql -u root -p < database.sql
```

### 3) Start the server
```bash
node server.js
```

The API will run on `http://localhost:3000` by default.

### 4) Access the frontend
Open your browser:
- `http://localhost:3000/index.html` (login)
- `http://localhost:3000/register.html` (register)

## 🧩 Role Overview

- **Patient**: upload medical reports, book appointments, reminders, insurance claims, prediction.
- **Doctor**: view appointments, upload reports for patients.
- **Insurance**: view and approve/reject claims.

## 📁 Key Files

- `server.js` - Express backend with JWT auth + role-based endpoints
- `public/` - Frontend pages and scripts
- `database.sql` - Database schema

## 🔐 Authentication
- Login returns a JWT stored in `localStorage`.
- Protected routes require `Authorization: Bearer <token>` in headers.

---

If you need a specific UI style (e.g., matching a screenshot), share the screenshot and I can update the frontend layout to match the design.
