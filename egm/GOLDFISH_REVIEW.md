# Goldfish Review: Adversarial Verification & Full-Stack Audit
**Methodology:** Google Elephant-Goldfish Model ([google/elephant-goldfish-model](https://github.com/google/elephant-goldfish-model))  
**Role:** Zero-Context Adversarial Reviewer & Auditor (Revision 2.3)  

---

## 1. Adversarial Review of UI/UX Refactor (Completed)

| Critique Lens | Identified Friction | Hardened Solution | Status |
| :--- | :--- | :--- | :--- |
| **Cluttered Filter Row** | Inline controls (sort dropdown + category pills + search + toggle) caused excessive cognitive load. | Replaced inline dropdowns with a clean **Filter Modal / Bottom Sheet** triggered by a single button. | **Resolved** |
| **Color Scheme Disconnect** | Dark theme clashed with clean white branding and official emblems. | Full transition to **Pure White / Light Pearl canvas** with official tri-color accents (Blue, Crimson, Gold). | **Resolved** |
| **Mobile Thumb Usability** | Desktop-focused layouts caused horizontal scrolling and tiny tap targets on mobile. | Added persistent **Mobile Bottom Navigation Bar** and touch-friendly bottom sheet modals. | **Resolved** |
| **Price Filtering UX** | Manual typing or sorting dropdown didn't allow combined price range filtering. | Added preset price filters (<৳500, ৳500-1000, ৳1000-2000, ৳2000+) + custom Min/Max inputs. | **Resolved** |

---

## 2. Full-Stack Adversarial Audit & Hardening Matrix

| Vector | Identified Hazard | Root Cause | Implemented Hardened Solution | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Storage & Concurrency** | Race condition lost updates & event loop lockups. | Uncoordinated sync `fs.writeFileSync` on `db.json`. | Implemented sequential `runAtomic` transaction queue, non-blocking `fs.promises`, and defensive `deepClone` in `src/lib/db.ts`. | **Resolved** |
| **Serverless Boundaries** | Temporary directory path failures across OS types. | Hardcoded `/tmp/db.json` on Windows/cloud. | Upgraded to dynamic `os.tmpdir()` with automatic directory creation and error resilience. | **Resolved** |
| **Arbitrary File Upload / Stored XSS** | Attackers could upload arbitrary files & executable SVGs. | No extension whitelist in `/api/upload` + SVG served as XML. | Added strict whitelist (`.jpg`, `.jpeg`, `.png`, `.webp`, `.pdf`), magic bytes binary signature check, CSP sandbox headers, and non-swallowed error handling. | **Resolved** |
| **Client Price Tampering** | Clients could order ৳1400 apparel for ৳1. | `/api/orders` trusted `item.price` sent by client. | Added server-side catalog lookup and customizer price calculation rules; client prices are overridden with server truth. | **Resolved** |
| **Phantom Courier Tracking** | Orders marked shipped with fake codes on courier failure. | Catch block in `/api/admin/steadfast` generated fake IDs. | Failures now return explicit HTTP 502 with error details; test modes are explicitly isolated as `[DEMO]`. | **Resolved** |
| **Print Station PDF Stream** | Operator download served a dummy template; base64 DB bloat. | Mock PDF in `/download` + base64 saved to JSON. | Persists base64 files to disk storage and streams the genuine student document from disk on download. | **Resolved** |
| **Admin Secret Exposure** | Master PIN sent plaintext in cookies; no brute-force shield. | Cookie contained raw PIN; no attempt limit. | Created `src/lib/auth.ts`: constant-time `timingSafeEqual`, IP sliding-window rate limiting (lockout after 5 fails), and HMAC-SHA256 signed session tokens. | **Resolved** |

---

## 3. Verification & Hardening Gate
- [x] **TypeScript Build:** `npx tsc --noEmit` verified with 0 type errors.
- [x] **Atomic Persistence:** Asynchronous transaction queue with race-condition prevention in `db.ts`.
- [x] **Price Protection:** Server-side catalog lookup enforces genuine prices in `/api/orders`.
- [x] **Upload Hardening:** Magic bytes validation, extension whitelist, CSP sandbox, and real file streaming.
- [x] **Auth Tokenization:** HMAC-SHA256 session tokens, timing-safe equality, and brute-force lockout.
