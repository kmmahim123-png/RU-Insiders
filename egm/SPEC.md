# Elephant Spec: RU Insiders White Theme & Decluttered Filter Architecture
**Methodology:** Google Elephant-Goldfish Model (EGM)
**Role:** Deep Context System Architecture Specification (Revision 2.1)
**Visual Identity:** Pure White Canvas, Royal Blue, Gold, and Crimson accents (derived from official emblem)
**Device Target:** Mobile-First Responsive (One UI 6.1 thumb ergonomics)

---

## 1. Visual Aesthetics & Light Theme Tokens
- **Background Canvas:** `#FFFFFF` (Pure White) and `#F8FAFC` (Slate 50 Pearl).
- **Surfaces & Cards:** Elevated white cards with subtle 1px border (`#E2E8F0`) and soft ambient shadows (`0 4px 20px -2px rgba(15, 23, 42, 0.05)`).
- **Brand Accents:**
  - `ru-blue`: `#1D4ED8` (Royal Blue)
  - `ru-crimson`: `#DC2626` (Vivid Crimson)
  - `ru-gold`: `#F59E0B` (Rich University Gold)
- **Typography:** Deep slate primary text (`#0F172A`), muted secondary text (`#64748B`).

---

## 2. Decluttered Filter Architecture
The previous inline filter bar had overcrowded components (sorting dropdown, search input, category pills, customizable toggle) causing visual fatigue ("hijibiji").

### New Architecture: Dedicated Slide-over / Modal Filter
- **Toolbar:** Minimalist bar with Search input and a prominent **"Filters" Action Trigger** showing active badge count.
- **Filter Sheet / Modal:**
  - **Category Picker:** Multi/Single select chips.
  - **Price Range Control:** Min/Max number inputs + quick preset range buttons (Under ৳500, ৳500-1000, ৳1000-2000, ৳2000+).
  - **Customizable Switch:** Instant filter for jersey/hoodie customizer.
  - **Sticky Bottom Apply Bar:** "Reset" and "Show Results" with live count.

---

## 3. Mobile-First Optimization
- Bottom navigation bar on mobile viewports for effortless thumb interaction:
  - 🏠 Home
  - 🛍️ Shop
  - ✨ Studio
  - 🖨️ Print Lagbe
  - 🛒 Cart
- Thumb-accessible bottom sheets replacing desktop dropdowns.
- Fast 2-column product grid with balanced image ratios and readable prices.
