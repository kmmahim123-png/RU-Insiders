# Elephant Spec: RU Insiders E-Commerce & Print-on-Demand Architecture
**Methodology:** Google Elephant-Goldfish Model (EGM)
**Role:** Deep Context System Architecture Specification
**Platform:** RU Insiders (Official Community Brand for Rajshahi University)
**Target Facebook Community:** https://www.facebook.com/ru.insiders/followers

---

## 1. System Vision & Objectives
RU Insiders is the premier digital hub for Rajshahi University students, alumni, faculty, and fans. The platform bridges three core pillars:
1. **Curated & University Branded Merchandise:** High-quality winter hoodies (শীতের হুডি), premium drop-shoulder tees, polo shirts, varsity jackets, and memorabilia bearing authentic Rajshahi University emblems.
2. **Interactive 2D Customization Studio:** Live interactive garment customizer allowing users to personalize jerseys, batch tees, and drop-shoulder shirts with custom player names, numbers, faculty logos, and placement controls.
3. **"Print Lagbe" (প্রিন্ট লাগবে) Instant Document Print Station:** A frictionless web-based queue solving the messy Telegram/WhatsApp/Messenger print problem. Students upload lecture slides, lab reports, assignments, or custom apparel graphics. Operators at the campus shop computer can preview, download, and execute direct prints with one click, while students track real-time queue status via Token/QR code.
4. **Comprehensive Admin & Executive Suite:**
   - Real-time revenue and profit analytics (Daily, Weekly, Monthly).
   - Margin calculator identifying high-velocity winners vs. low-velocity deadstock.
   - Steadfast Courier Service API integration for 1-click consignment booking and tracking.
   - Live Print Station Operator Console with audible alert and status lifecycle.

---

## 2. Concurrency & Scalability Design (1 Million / 10 Lakh Users)
To reliably serve flash sales (e.g. university fest, convocation batches, admission seasons) with 10 lakh+ visitors:
- **Next.js 15 App Router + Edge Cache:** Static and ISR rendering for product catalogs; zero database round-trips for uncached reads.
- **Client-Side Vector Rendering for Customizer:** SVG/HTML5 Canvas client rendering ensures zero server GPU/CPU load during interactive jersey design.
- **Stateless API Routes:** Decoupled JWT session verification without server state bottlenecks.
- **Asynchronous File Handling & Stream Delivery:** Large PDF uploads for the Print Station are verified via streaming chunk boundaries with MIME and magic-number validation to prevent memory exhaustion.
- **Modular Data Layer:** Portable repository layer ready for PostgreSQL (Neon/Supabase/Prisma) with connection pooling and in-memory high-speed cache.

---

## 3. Data Models & Schemas

### Product Entity
- `id`: string (UUID)
- `title`: string
- `slug`: string (unique)
- `category`: 'hoodies' | 'drop-shoulder' | 'jerseys' | 't-shirts' | 'accessories'
- `description`: string
- `regularPrice`: number (BDT)
- `salePrice`: number (BDT)
- `costPrice`: number (BDT) -> For profit analytics
- `images`: string[]
- `colors`: { name: string, hex: string }[]
- `sizes`: ('S' | 'M' | 'L' | 'XL' | 'XXL' | 'Oversized')[]
- `isCustomizable`: boolean
- `stock`: number
- `salesCount`: number
- `isFeatured`: boolean

### Customizer Order Entity
- `garmentType`: 'jersey' | 'dropshoulder' | 'hoodie' | 'tshirt'
- `baseColor`: string
- `size`: string
- `playerName`: string (optional)
- `playerNumber`: string (optional)
- `backText`: string (optional)
- `badge`: 'ru-monogram' | 'shabash-bangladesh' | 'ru-paris-road' | 'custom'
- `badgePosition`: 'left-chest' | 'center' | 'back'

### Print Job ("Print Lagbe") Entity
- `id`: string
- `token`: string (e.g. `RU-PRNT-8429`)
- `fileName`: string
- `fileUrl`: string
- `fileSizeBytes`: number
- `pageCount`: number
- `printType`: 'bw' | 'color'
- `paperType`: 'normal-80gsm' | 'art-paper' | 'glossy'
- `doubleSided`: boolean
- `copies`: number
- `totalAmount`: number
- `customerName`: string
- `customerPhone`: string
- `status`: 'queued' | 'printing' | 'ready_for_pickup' | 'delivered' | 'cancelled'
- `paymentStatus`: 'unpaid' | 'paid_bkash' | 'paid_cash'
- `createdAt`: ISO timestamp

### Steadfast Courier Consignment
- `consignmentId`: string
- `trackingCode`: string
- `orderId`: string
- `recipientName`: string
- `recipientPhone`: string
- `recipientAddress`: string
- `codAmount`: number
- `deliveryStatus`: string

---

## 4. Security Architecture (Marketplace Audit Level)
1. **Zero Secrets in Code:** Pure `.env` parameterization; all defaults safe or strictly flagged.
2. **Pinned Dependencies:** Strict semver resolution; zero floating ranges (`^` or `~` eliminated for core dependencies).
3. **Strict RBAC & Scoped Auth:** Admin operations protected by cryptographic session tokens; order lookups scoped strictly by Token + Phone verification or authenticated user ID to eliminate IDOR.
4. **Parameterized Data Access:** Zero string concatenation in data filters; defensive input sanitization via Zod schema validation.
5. **Clean Code Modularization:** Maximum single-responsibility per component (< 300 lines); shared design-system UI primitives.
6. **Automated Reproducibility:** Single-command clean install (`npm install && npm run dev`) verified from README alone.
