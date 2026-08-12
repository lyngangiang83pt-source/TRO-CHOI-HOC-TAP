---
name: taste-skill
description: Anti-slop frontend design skill for landing pages, portfolios, and web apps. Ensures human-designed aesthetics, intentional typography, color calibration, layout diversification, zero templated slop, and anti-cliché design rules.
---

# taste-skill: Anti-Slop Frontend Design Skill

> Landing pages, portfolios, and web apps.
> Every rule below is **contextual**. First read the brief, then pull only what fits.

---

## 0. BRIEF INFERENCE (Read the Room Before Anything Else)

Before touching code or tweaking dials, **infer what the user actually wants**. Most LLM design output is bad because the model jumps to a default aesthetic instead of reading the room.

### 0.A Read these signals first
1. **Page kind** - landing (SaaS / consumer / agency / event), portfolio (dev / designer / creative studio), redesign (preserve vs overhaul), edtech / gamified, editorial / blog.
2. **Vibe words** the user used - "minimalist", "calm", "Linear-style", "Awwwards", "brutalist", "premium consumer", "Apple-y", "playful", "gamified E-sports", "serious B2B", "editorial", "glassy".
3. **Reference signals** - URLs linked, screenshots pasted, products named.
4. **Audience** - B2B procurement vs design-conscious consumer vs students/teachers. The audience picks the aesthetic, not your taste.
5. **Brand assets that already exist** - logo, color, type, iconography.
6. **Quiet constraints** - accessibility-first, public-sector, kids/students products.

### 0.B Output a one-line "Design Read" before generating
Before any code, state in one line: **"Reading this as: <page kind> for <audience>, with a <vibe> language, leaning toward <design system or aesthetic family>."**

### 0.C Anti-Default Discipline
Do not default to: AI-purple gradients, centered hero over dark mesh, three equal feature cards, generic glassmorphism on everything, infinite-loop micro-animations everywhere, Inter + slate-900. Re-evaluate deliberately based on the design read.

---

## 1. THE THREE DIALS (Core Configuration)

* **`DESIGN_VARIANCE: 8`** - 1 = Perfect Symmetry, 10 = Artsy Chaos
* **`MOTION_INTENSITY: 6`** - 1 = Static, 10 = Cinematic / Physics
* **`VISUAL_DENSITY: 4`** - 1 = Art Gallery / Airy, 10 = Cockpit / Packed Data

---

## 2. DESIGN ENGINEERING DIRECTIVES (Anti-Slop Rules)

### 2.1 Typography & Font Selection
* **Display / Headlines:** `text-4xl md:text-6xl tracking-tighter leading-none`.
* **Body / Paragraphs:** `text-base leading-relaxed max-w-[65ch]`.
* **Sans Font Choices:** Prefer `Geist`, `Plus Jakarta Sans`, `Outfit`, `Cabinet Grotesk`, `Space Grotesk`, or `Satoshi` over default Inter.
* **Serif Discipline:** Serif is **very discouraged as default**. Use serifs ONLY when explicitly requested by brand brief (editorial / manuscript).
* **Emphasis Rule:** Use italic/bold of the SAME font family. Do NOT inject random serif words into a sans headline.

### 2.2 Color Calibration
* Max 1 accent color. Saturation < 80% by default.
* **The Lila Rule:** Avoid default AI-purple button glows on neutral black. Pick high-contrast singular accents (Emerald, Electric Cyan, Deep Rose, Amber, etc.) matching the brand.
* **Color Consistency Lock:** Lock accent color for the WHOLE page.

### 2.3 Layout Diversification & Grid Mechanics
* **Anti-Center Bias:** Avoid centered hero / H1 unless editorial. Use split-screen (50/50), asymmetric whitespace, or scroll-pinned layouts.
* **Grid over Flex-Math:** Use CSS Grid (`grid grid-cols-1 md:grid-cols-3 gap-6`) instead of flexbox percentage math.
* **Viewport Stability:** Use `min-h-[100dvh]` instead of `h-screen` for hero sections on mobile devices.
* **Eyebrow Restraint:** Max 1 small uppercase tracking eyebrow label per 3 sections.
* **Section-Layout-Repetition Ban:** Never repeat the exact same layout structure across consecutive sections.

### 2.4 Tactile Interactive States
* **Buttons:** Must have explicit tactile feedback on `:active` (`scale-[0.98]` or `-translate-y-[1px]`).
* **Button Contrast Check:** Verify text readability against button background (WCAG AA min 4.5:1).
* **No Label Wrap:** Primary CTA labels must fit on a single line on desktop.

---

## 3. CHECKLIST BEFORE SHIPPING (Pre-Flight Audit)

- [ ] Has a 1-line **Design Read** been declared?
- [ ] Is the primary CTA text readable with WCAG AA contrast?
- [ ] Is layout responsive across mobile (640), tablet (768), and desktop (1024+)?
- [ ] Are all icons using a single icon family with standardized `strokeWidth`?
- [ ] Is the page free of repetitive eyebrow labels and AI-purple default slop?
