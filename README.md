# PokePlaza

A Next.js (App Router) app with email/password **signup** and **NextAuth** authentication (Google OAuth + Credentials) backed by **MongoDB**.

## Features

* Email/password **signup** via `/api/auth/signup` (hashes password and stores user in MongoDB)
* **Sign in with Google** (`next-auth` Google provider)
* **Credentials sign-in** (email + password)
* Ready-to-use pages at `/signup` and `/signin`

---

## Prerequisites

* **Node.js 18.17+** (or Node 20+)
* **npm**, **pnpm**, or **yarn**
* **MongoDB** (Atlas or local)

---

## Quick Start

```bash
# 1) Clone
git clone https://github.com/j1munoz/poke-plaza.git
cd https://github.com/j1munoz/poke-plaza.git

# 2) Install dependencies (choose one)
npm install

# 3) Configure environment variables
# If an example file exists:
# cp .env.local.example .env.local
# Otherwise, create .env.local (see "Environment Variables" below)

# 4) Run the dev server
pnpm dev        # or: npm run dev / yarn dev

# 5) Open the app
# http://localhost:3000
```

---

## Environment Variables

Create a file named **`.env.local`** in the project root with, fill in with your info :

```dotenv
# Mongo
MONGODB_URI="<your-mongodb-connection-string>"
MONGODB_DB="pokeplaza"

# NextAuth / App
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="<a-long-random-string>"

# Google OAuth
GOOGLE_CLIENT_ID="<your-google-client-id>"
GOOGLE_CLIENT_SECRET="<your-google-client-secret>"

JWT_SECRET="<a-long-random-string>"
```

---

## Google OAuth Setup (NextAuth)

1. Go to **Google Cloud Console** → APIs & Services → **Credentials**.
2. Create **OAuth 2.0 Client ID** of type **Web application**.
3. Add this **Authorized redirect URI**:

   ```
   http://localhost:3000/api/auth/callback/google
   ```
4. Put the resulting `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` into `.env.local`.
5. Ensure `NEXTAUTH_URL` matches your dev URL and set a strong `AUTH_SECRET`.

---

## Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Run the production build locally
npm start
```

---

## Useful URLs

* **Signin:** `http://localhost:3000/signin`

---

## High Level View

* **/signup** posts `{ email, password, name? }` to **`/api/auth/signup`**.
  The API validates input, checks for an existing user, hashes the password with `bcrypt`, inserts the user, and responds with `{ ok: true, redirect: "/signin" }`.
* **/signin** supports:

  * **Google**: `signIn("google")`
  * **Credentials**: `signIn("credentials", { email, password })`

---

## Troubleshooting

* **“Invalid credentials” on sign-in**
  Verify the user exists in MongoDB and the password is correct. Double-check `MONGODB_URI`/`MONGODB_DB`.

* **“Email already in use” on signup**
  The API checks for an existing email before insert—use a new email or remove the existing document.

* **Google OAuth error**
  Ensure the redirect URI exactly matches
  `http://localhost:3000/api/auth/callback/google`, and that `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` are set correctly.
