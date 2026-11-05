# Goldfish Review: Adversarial Verification & Full-Stack Audit
**Methodology:** Google Elephant-Goldfish Model ([google/elephant-goldfish-model](https://github.com/google/elephant-goldfish-model))  
**Role:** Zero-Context Adversarial Reviewer & Auditor (Revision 2.2)  

---

## 1. Adversarial Review of UI/UX Refactor (Completed)

| Critique Lens | Identified Friction | Hardened Solution | Status |
| :--- | :--- | :--- | :--- |
| **Cluttered Filter Row** | Inline controls (sort dropdown + category pills + search + toggle) caused excessive cognitive load. | Replaced inline dropdowns with a clean **Filter Modal / Bottom Sheet** triggered by a single button. | Verified |
| **Color Scheme Disconnect** | Dark theme clashed with clean white branding and official emblems. | Full transition to **Pure White / Light Pearl canvas** with official tri-color accents (Blue, Crimson, Gold). | Verified |
| **Mobile Thumb Usability** | Desktop-focused layouts caused horizontal scrolling and tiny tap targets on mobile. | Added persistent **Mobile Bottom Navigation Bar** and touch-friendly bottom sheet modals. | Verified |
| **Price Filtering UX** | Manual typing or sorting dropdown didn't allow combined price range filtering. | Added preset price filters (<৳500, ৳500-1000, ৳1000-2000, ৳2000+) + custom Min/Max inputs. | Verified |

---

## 2. Full-Stack Adversarial Audit (Backend, Storage & Security)

A cold-read review across the API and persistence layer exposed 8 critical failure modes:

| Vector | Identified Hazard | Root Cause | Priority |
| :--- | :--- | :--- | :--- |
| **Storage Ephemerality** | Data wiped on redeployment or serverless cold restart. | `db.json` stored in `/tmp` and in-memory cache; no persistent cloud DB. | **Critical** |
| **State Split-Brain** | Inconsistent orders and products across lambda containers. | Independent memory heaps per serverless instance without distributed cache. | **Critical** |
| **Concurrency / Lost Updates** | Simultaneous orders overwrite each other in `db.json`. | No mutex, row lock, or file lock on `readDb()` / `writeDb()`. | **High** |
| **Arbitrary File Upload / Stored XSS** | Attackers can upload `.html` or malicious `.svg` files with scripts. | No extension whitelist in `/api/upload` + SVG served as `image/svg+xml`. | **Critical** |
| **Client Price Tampering** | Attackers can place orders with arbitrary unit prices (e.g. ৳1 for a hoodie). | `/api/orders` trusts `item.price` sent by client without catalog verification. | **Critical** |
| **Phantom Courier Tracking** | Orders marked shipped with fake codes when courier API fails. | Catch block in `/api/admin/steadfast` generates fake consignment ID on error. | **High** |
| **Print Station Fake PDF** | Operators cannot download actual submitted student files. | `/api/print-station/download` serves hardcoded mock PDF text. | **High** |
| **Admin Secret Exposure** | Master PIN sent plaintext in cookies; default fallback '1953'. | Cookie `ru_admin_token` contains raw PIN without hashing or session JWT. | **High** |

---

## 3. Verification & Hardening Gate
- [x] **TypeScript Build:** `npx tsc --noEmit` verified with 0 type errors.
- [ ] **Data Durability:** Move from local/ephemeral `db.json` to Supabase / PostgreSQL.
- [ ] **Price Validation:** Server-side lookup of genuine product price before creating order records.
- [ ] **Upload Hardening:** Restrict uploads to safe extensions (`.jpg`, `.png`, `.webp`, `.pdf`) and sanitize SVG files.
- [ ] **Auth Tokenization:** Migrate admin PIN check to signed session cookies with rate limiting.
