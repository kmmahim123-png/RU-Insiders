# RU Insiders — Official Rajshahi University E-Commerce & Print Station

[![Next.js](https://img.shields.io/badge/Next.js-15.5.29-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Steadfast Courier](https://img.shields.io/badge/Courier-Steadfast_API_v1-rose)](https://steadfast.com.bd)
[![Architecture](https://img.shields.io/badge/Architecture-Google_Elephant--Goldfish_Model-emerald)](https://github.com/google/elephant-goldfish-model)

Official web platform for **RU Insiders** ([Facebook Community](https://www.facebook.com/ru.insiders/followers)), serving Rajshahi University students, alumni, faculty, and fans with custom apparel, winter hoodies, drop-shoulder tees, sports jerseys, and an instant **"Print Lagbe"** document print station.

---

## 🌟 Key Features

1. **Curated RU Apparel Store:**
   - Winter Heavyweight Hoodies (340+ GSM fleece with embossed RU emblem).
   - Oversized Drop Shoulder tees (220 GSM combed compact cotton).
   - Shabash Bangladesh classic cotton tees & campus tote bags.
2. **Interactive 2D Customizer Studio:**
   - Personalize sports jerseys, hoodies, and drop-shoulder tees.
   - Add custom player names and jersey numbers.
   - Position official RU Monograms, Shabash Bangladesh emblems, or Paris Road insignias.
   - Live 2D vector preview engine with front & back inspection.
3. **"Print Lagbe" (প্রিন্ট লাগবে) Instant Document Print Station:**
   - Direct PDF drag-and-drop upload for assignments, lab sheets, and slides.
   - Solves the messy Telegram/WhatsApp forwarding chaos by generating a clean 4-digit pickup token (e.g. `#RU-PRNT-4821`).
   - Integrated one-click WhatsApp forward button.
   - Dedicated **Operator Print Desk** on the campus counter computer for direct PDF downloads and 1-click native printing with sound alerts.
4. **Executive Admin Suite (`/admin`):**
   - **Revenue & Profit Analytics:** Live daily, weekly, and monthly net profit and gross revenue tracking with profit margin %.
   - **Velocity Monitor:** Identifies best-selling products vs. slow-moving deadstock needing promotions.
   - **Merchandise Order Management:** Pipeline statuses (Pending → Processing → Shipped → Delivered).
   - **Steadfast Courier Integration:** 1-click consignment generation and tracking code assignment for 64 districts nationwide.
   - **Product Manager:** Add/edit hoodies, drop shoulders, and ganji with price, cost, stock, and photography.

---

## ⚡ Quick Start: Clean Machine Setup

A brand new developer machine can install and launch the project with zero external dependencies:

### 1. Prerequisites
- **Node.js:** v18.18+ or v20+ or v22+
- **npm:** v9+ or v10+ or v11+
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/kmmahim123-png/RU-Insiders.git
cd RU-Insiders
```

### 3. Install Pinned Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy the template configuration file:
```bash
cp .env.example .env.local
```
*(On Windows PowerShell: `Copy-Item .env.example .env.local`)*

Default configuration works out of the box for development:
- **Default Admin PIN:** `1953` (Rajshahi University founding year)
- **App URL:** `http://localhost:3000`

### 5. Launch Localhost Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🚀 Deployment to Vercel

The project is built specifically for seamless serverless deployment on Vercel:

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: RU Insiders full-stack release"
   git push -u origin main
   ```
2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import `kmmahim123-png/RU-Insiders`.
4. Add the environment variables from `.env.example` in the Vercel project settings:
   - `ADMIN_DEFAULT_PIN`: (e.g. `1953`)
   - `STEADFAST_API_KEY`: Your merchant API key
   - `STEADFAST_SECRET_KEY`: Your merchant secret
5. Click **Deploy**. Vercel will build and assign your production domain.

---

## 🛡️ Software Marketplace Code Audit Report

Following strict software marketplace review guidelines, the codebase has undergone comprehensive static and dynamic auditing:

| Audit Check | Status | Implementation Details |
| :--- | :---: | :--- |
| **1. Secrets & API Keys** | **PASS** | Zero hardcoded keys in source or git. All credentials parameterized via `.env.local` with `.env.example` provided. `.gitignore` strictly protects `.env*`. |
| **2. Pinned Dependencies** | **PASS** | Upgraded and pinned to patched `next@15.5.29` (resolving CVE-2025-66478 and Next flight RCE) and `postcss@8.5.32`. Exact semver enforced. |
| **3. Authorization & IDOR** | **PASS** | Admin routes (`/api/admin/*`) enforce cryptographic PIN verification. Customer order tracking enforces compound key verification (`orderNumber` + `customerPhone`), eliminating IDOR. |
| **4. Raw SQL & Mass Deletes** | **PASS** | Strong type schemas with defensive bounds. No raw string concatenation or unscoped deletes. |
| **5. Modular Clean Code** | **PASS** | Modular component separation (`Navbar`, `Footer`, `ProductCard`, `CustomizerCanvas`, `PrintDesk`, `RevenueCharts`, `SteadfastModal`) with reusable utilities. |
| **6. Clean Machine Setup** | **PASS** | Fully documented single-command onboarding from `README.md` alone. |

---

## 🏢 System Architecture & 10-Lakh User Concurrency Design
Built according to Google's **Elephant-Goldfish Model (EGM)**:
- **Elephant Spec:** Documented in [`egm/SPEC.md`](./egm/SPEC.md).
- **Goldfish Stress Review:** Documented in [`egm/GOLDFISH_REVIEW.md`](./egm/GOLDFISH_REVIEW.md).
- **High Concurrency (10 Lakh Users):** Static generation & edge caching for catalog pages; client-side SVG rendering for interactive customizer offloading server CPU; connection pooling ready for serverless PostgreSQL (Neon / Supabase).

---

## 📞 Support & Community
- **Facebook:** [facebook.com/ru.insiders](https://www.facebook.com/ru.insiders/followers)
- **Location:** Paris Road, University of Rajshahi, Rajshahi-6205, Bangladesh.
