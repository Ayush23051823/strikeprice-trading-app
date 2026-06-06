<div align="center">

<img src="public/assets/icons/logo.svg" alt="StrikePrice Logo" width="200"/>

# StrikePrice

### Real-time stock market data, AI-powered insights & smart price alerts — all in one place.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-strikeprice.vercel.app-yellow?style=for-the-badge&logo=vercel)](https://strikeprice-trading-app.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Live Dashboard** | Real-time market overview with TradingView charts and sector heatmap |
| ⭐ **Watchlist** | Add and track your favourite stocks in one place |
| 🔔 **Price Alerts** | Set upper/lower price thresholds and get notified by email |
| 📈 **Portfolio Tracker** | Add your holdings, track shares, buy price and total cost |
| ⚖️ **Stock Comparison** | Compare up to 3 stocks side by side with live data |
| 🚀 **Top Movers** | See the biggest gainers and losers of the day |
| 🤖 **AI Market Digest** | Daily market summary powered by Google Gemini AI |
| 🔐 **Authentication** | Secure email/password sign up and sign in |
| 📧 **Email Notifications** | Welcome emails and daily news digest via Nodemailer |

---

## 🛠️ Tech Stack

**Frontend**
- [Next.js 16](https://nextjs.org) — App Router, Server Components, Turbopack
- [TypeScript](https://www.typescriptlang.org) — Type-safe codebase
- [Tailwind CSS v4](https://tailwindcss.com) — Utility-first styling
- [TradingView Widgets](https://www.tradingview.com) — Charts, heatmaps, technical analysis
- [shadcn/ui](https://ui.shadcn.com) — Accessible UI components

**Backend & Database**
- [MongoDB Atlas](https://www.mongodb.com/atlas) — Cloud database
- [Mongoose](https://mongoosejs.com) — Data modelling
- [Better Auth](https://better-auth.com) — Authentication & session management
- [Inngest](https://inngest.com) — Background jobs & event-driven functions

**APIs & AI**
- [Finnhub API](https://finnhub.io) — Real-time stock quotes & company data
- [Google Gemini AI](https://aistudio.google.com) — AI-powered market digest
- [Nodemailer](https://nodemailer.com) — Transactional email delivery

**Deployment**
- [Vercel](https://vercel.com) — Hosting & CI/CD

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas account (free)
- Finnhub API key (free)
- Google Gemini API key (free)
- Gmail account with App Password

### 1. Clone the repository

```bash
git clone https://github.com/Ayush23051823/strikeprice-trading-app.git
cd strikeprice-trading-app/signalist_stock-tracker-app-main
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project:

```env
NODE_ENV='development'
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# FINNHUB — get free key at finnhub.io
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_key
FINNHUB_API_KEY=your_finnhub_key
FINNHUB_BASE_URL=https://finnhub.io/api/v1

# MONGODB — free cluster at mongodb.com/atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/strikeprice

# BETTER AUTH
BETTER_AUTH_SECRET=your_random_secret_string
BETTER_AUTH_URL=http://localhost:3000

# GEMINI AI — free key at aistudio.google.com
GEMINI_API_KEY=your_gemini_key

# NODEMAILER — Gmail + App Password
NODEMAILER_EMAIL=your@gmail.com
NODEMAILER_PASSWORD=your_16_char_app_password
```

### 4. Run the development server

Open **two terminals:**

**Terminal 1 — Next.js:**
```bash
npm run dev
```

**Terminal 2 — Inngest (background jobs):**
```bash
npx inngest-cli@latest dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
signalist_stock-tracker-app-main/
├── app/
│   ├── (auth)/              # Sign in & Sign up pages
│   ├── (root)/              # Protected app pages
│   │   ├── page.tsx         # Dashboard
│   │   ├── watchlist/       # Watchlist page
│   │   ├── alerts/          # Price alerts page
│   │   ├── portfolio/       # Portfolio tracker
│   │   ├── compare/         # Stock comparison
│   │   ├── movers/          # Top gainers & losers
│   │   ├── digest/          # AI market digest
│   │   └── stocks/[symbol]/ # Individual stock page
│   └── api/
│       ├── auth/[...all]/   # Better Auth API handler
│       ├── inngest/         # Inngest background jobs
│       └── stock-quote/     # Stock quote API
├── components/              # Reusable UI components
├── database/
│   └── models/              # Mongoose models
├── lib/
│   ├── actions/             # Server actions
│   ├── better-auth/         # Auth configuration
│   ├── inngest/             # Background job functions
│   └── nodemailer/          # Email templates
├── public/                  # Static assets
├── types/                   # TypeScript type definitions
└── proxy.ts                 # Next.js proxy (auth guard)
```

---

## 🌐 Deployment on Vercel

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import your repo
3. Set **Root Directory** to `signalist_stock-tracker-app-main`
4. Add all environment variables (same as `.env` but with your production URLs)
5. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_BASE_URL` to your Vercel deployment URL
6. In MongoDB Atlas → **Network Access** → Allow access from anywhere (`0.0.0.0/0`)
7. Click **Deploy**

---

## 🔑 Getting API Keys

| Service | Link | Free Tier |
|---|---|---|
| Finnhub | [finnhub.io](https://finnhub.io) | 60 calls/min |
| MongoDB Atlas | [mongodb.com/atlas](https://www.mongodb.com/products/platform/atlas-database) | 512 MB storage |
| Google Gemini | [aistudio.google.com](https://aistudio.google.com) | Free tier available |
| Gmail App Password | [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) | Free |

---
## 📸 Screenshots

> Dashboard, Watchlist, Price Alerts, Portfolio Tracker, AI Digest
> <img width="1600" height="739" alt="image" src="https://github.com/user-attachments/assets/401cc33d-7923-439e-b4c4-da9b267cb4a2" />
> <img width="1600" height="737" alt="image" src="https://github.com/user-attachments/assets/00f866b1-d97b-4d15-a7e6-430f124f625d" />
<img width="1600" height="740" alt="image" src="https://github.com/user-attachments/assets/84c3fc97-668a-4004-ba8b-461ed5a14f38" />
<img width="1600" height="741" alt="image" src="https://github.com/user-attachments/assets/2044dbf6-3772-4d63-8ff3-8deec23e7d95" />
<img width="1600" height="738" alt="image" src="https://github.com/user-attachments/assets/9f14122d-7f17-4005-b053-aba2a195b296" />
<img width="1600" height="729" alt="image" src="https://github.com/user-attachments/assets/5e24820d-c144-4be2-a9ab-c2db09f77e9a" />



---

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Feel free to open a [GitHub issue](https://github.com/Ayush23051823/strikeprice-trading-app/issues).

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Built by

**Ayush Kumar**
- GitHub: [@Ayush23051823](https://github.com/Ayush23051823)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/ayush-kumar-4373662a9/)
- Live: [strikeprice-trading-app.vercel.app](https://strikeprice-trading-app.vercel.app)

---

<div align="center">
  <p>If you found this useful, please ⭐ star the repo!</p>
  <p>Built with ❤️ using Next.js, MongoDB & Gemini AI</p>
</div>
