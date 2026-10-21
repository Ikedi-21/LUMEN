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
src/
├── app/
│   ├── layouts/          # StorefrontLayout, AdminLayout, MinimalLayout
│   ├── routes.jsx        # Centralized route definitions
│   └── providers.jsx     # Global context providers
├── features/
│   ├── storefront/       # Public-facing pages & components
│   ├── auth/             # Login, Signup, Settings, Staff Application
│   ├── admin/            # Dashboard, Products, Sales, Earnings
│   ├── manager/          # Staff & Payout management
│   └── staff/            # Staff-specific views
├── hooks/                # Custom React hooks
├── services/             # Supabase API service layer
├── shared/               # Reusable UI components & utilities
└── styles/               # Global stylesheets
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
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Paystack
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

> **Never** commit your `.env.local` file to version control.

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI library |
| [Vite 8](https://vitejs.dev/) | Build tool & dev server |
| [React Router 7](https://reactrouter.com/) | Client-side routing |
| [Supabase](https://supabase.com/) | Auth, database & storage backend |
| [react-paystack](https://github.com/iamraphson/react-paystack) | Payment processing |
| [Recharts](https://recharts.org/) | Analytics & charts |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Google Fonts](https://fonts.google.com/) | Typography (Playfair Display + Inter) |

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
