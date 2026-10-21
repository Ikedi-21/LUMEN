<h1 align="center">
  <br/>
  🎬 Lumen
  <br/>
</h1>

<p align="center">
  <strong>Your all-in-one digital media storefront — Movies, Manga, Books &amp; Comics.</strong>
  <br />
  Built with React 19, Vite, and Supabase.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router 7" />
  <img src="https://img.shields.io/badge/Paystack-00C3F7?style=for-the-badge&logo=stripe&logoColor=white" alt="Paystack" />
</p>

---

## 📖 Overview

**Lumen** is a full-stack digital media platform where users can browse, purchase, and access movies, manga, books, and comics. It features a polished public storefront, secure authentication, a personal library, a wallet top-up system, and a comprehensive admin/manager dashboard for content and team management.

---

## ✨ Features

### 🛍️ Storefront
- 🏠 **Home** — Curated landing page showcasing featured media
- 🔍 **Browse & Search** — Filter by category (movies, manga, books, comics)
- 📄 **Product Detail Pages** — Rich media descriptions, covers, and purchase options
- 🛒 **Cart & Checkout** — Smooth cart flow with Paystack payment integration
- ❤️ **Wishlist** — Save items for later
- 📚 **Personal Library** — Access all purchased/unlocked content
- 🎬 **Watch Page** — In-app media viewer
- 🧾 **Purchase Receipt** — Order confirmation and summary
- 💳 **Wallet Top-Up** — Credit balance to use across the platform

### 🔐 Authentication
- Secure **Sign Up** / **Log In** with Supabase Auth
- **Settings Page** — Manage account preferences
- **Staff Application** — Apply to join the content team

### 🛠️ Admin Dashboard
- 📊 **Analytics** — Sales charts and earnings reports powered by Recharts
- 📦 **Product Management** — Create, edit, and manage all media listings
- 💰 **Sales & Earnings** — Track platform revenue at a glance
- 👥 **Staff Management** — View and manage team members
- 💸 **Payout Review** — Approve or review staff payouts

### ℹ️ Company Pages
- About, Careers, Contact, FAQ, Privacy Policy, Terms of Service, Cookie Preferences

---

## 🗂️ Project Structure

```
media-vault/
├── api/
│   └── verify-coin-purchase.js   # Vercel Serverless Function — Paystack verification
├── supabase/
│   └── migrations/               # PostgreSQL schema migrations
├── public/                        # Static assets
└── src/
    ├── app/
    │   ├── layouts/               # StorefrontLayout, AdminLayout, MinimalLayout
    │   ├── routes.jsx             # Centralized route definitions
    │   └── providers.jsx          # Global context providers (Auth, Storefront, Toast)
    ├── features/
    │   ├── storefront/            # Public-facing pages, components & context
    │   ├── auth/                  # Login, Signup, Settings, Staff Application
    │   ├── admin/                 # Dashboard, Products, Sales, Earnings
    │   ├── manager/               # Staff & Payout management
    │   └── staff/                 # Staff-specific views
    ├── hooks/                     # Custom React hooks
    ├── services/                  # Supabase service layer (products, cart, purchases…)
    ├── shared/
    │   ├── guards/                # Auth & role-based route guards
    │   ├── hooks/                 # Shared utility hooks
    │   ├── lib/                   # Helper utilities
    │   └── ui/                    # Reusable UI components (Toast, etc.)
    └── styles/
        ├── tokens.css             # Design tokens (colors, spacing, typography)
        ├── reset.css              # CSS reset
        ├── buttons.css            # Button system
        └── main.css               # Global styles
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A [Supabase](https://supabase.com) project
- A [Paystack](https://paystack.com) account

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/media-vault.git
cd media-vault

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your Supabase and Paystack credentials (see below)

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root of the project with the following keys:

```env
# ─── Supabase ───────────────────────────────────────────
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# ─── Supabase (Server-side only — Vercel Serverless) ────
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ─── Paystack ───────────────────────────────────────────
VITE_PAYSTACK_PUBLIC_KEY=pk_live_or_test_xxxxxxxx     # Client-side (public)
PAYSTACK_SECRET_KEY=sk_live_or_test_xxxxxxxx          # Server-side only
```

> [!CAUTION]
> **Never** expose `SUPABASE_SERVICE_ROLE_KEY` or `PAYSTACK_SECRET_KEY` on the client.
> These are server-side only and are used exclusively inside the `/api` Vercel Serverless Functions.
> Prefix client-safe variables with `VITE_` so Vite includes them in the bundle.

---

## 🧰 Tech Stack

### 🖥️ Frontend

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19 | Core UI library — with `useContext`, custom hooks & providers |
| [Vite](https://vitejs.dev/) | 8 | Lightning-fast dev server & production bundler |
| [React Router](https://reactrouter.com/) | 7 | Client-side routing with nested layouts & protected routes |
| [Recharts](https://recharts.org/) | 3 | Sales analytics & earnings charts on the admin dashboard |
| [Lucide React](https://lucide.dev/) | 1 | Consistent SVG icon system throughout the UI |

### 🗄️ Backend & Database

| Technology | Purpose |
|---|---|
| [Supabase](https://supabase.com/) | Hosted PostgreSQL database, row-level security (RLS), and storage |
| [Supabase Auth](https://supabase.com/docs/guides/auth) | Email/password authentication with session management |
| [Supabase Storage](https://supabase.com/docs/guides/storage) | Media file uploads (covers, video files) |
| [PostgreSQL Migrations](./supabase/migrations/) | Version-controlled schema changes (story groups, staff applications) |

### 💳 Payments

| Technology | Purpose |
|---|---|
| [Paystack](https://paystack.com/) | Payment gateway for wallet top-ups (NGN) |
| [react-paystack](https://github.com/iamraphson/react-paystack) | Paystack checkout integration on the client |
| Vercel Serverless Function (`/api/verify-coin-purchase`) | Server-side Paystack transaction verification + coin crediting |

### 🎨 UI & Design

| Technology | Purpose |
|---|---|
| Vanilla CSS | All styling — no CSS framework |
| CSS Custom Properties (Design Tokens) | Centralized color, spacing & typography tokens in `tokens.css` |
| [Google Fonts](https://fonts.google.com/) | **Playfair Display** (display/headings) + **Inter** (body text) |
| CSS Reset | Custom reset in `reset.css` for cross-browser consistency |
| CSS Button System | Reusable button variants defined in `buttons.css` |

### ⚙️ Tooling & Infrastructure

| Technology | Purpose |
|---|---|
| [Vercel](https://vercel.com/) | Hosting, CI/CD & Serverless Functions runtime |
| [ESLint 10](https://eslint.org/) | Code quality with `eslint-plugin-react-hooks` & `react-refresh` |
| Path Aliases (`@/`) | `@/` maps to `src/` via Vite config for clean imports |
| [Node.js](https://nodejs.org/) | Runtime for Vercel Serverless Functions |

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint checks |

---

## 🚢 Deployment

This project is configured for deployment on **Vercel**.

```bash
# Install Vercel CLI (optional)
npm install -g vercel

# Deploy
vercel
```

Alternatively, connect your GitHub repository directly to [Vercel](https://vercel.com) for automatic deployments on every push to `main`.

> Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

---

## 🤝 Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ by the Lumen team</p>
