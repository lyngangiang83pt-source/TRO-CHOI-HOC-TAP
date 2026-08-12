---
name: redesign-existing-projects
description: Upgrades existing websites and apps to premium quality. Audits current design, identifies generic AI patterns, and applies high-end design standards without breaking functionality. Works with any CSS framework or vanilla CSS.
---

# Redesign Skill

## How This Works

When applied to an existing project, follow this sequence:

1. **Scan** — Read the codebase. Identify the framework, styling method (Tailwind, vanilla CSS, styled-components, etc.), and current design patterns.
2. **Diagnose** — Run through the audit below. List every generic pattern, weak point, and missing state you find.
3. **Fix** — Apply targeted upgrades working with the existing stack. Do not rewrite from scratch. Improve what's there.

## Design Audit

### Typography
- **Replace Inter / Browser defaults** with Geist, Outfit, Cabinet Grotesk, or Satoshi.
- **Headlines lack presence:** Increase display text size, tighten letter-spacing (`tracking-tighter`), reduce line-height.
- **Body text width:** Limit paragraph width to ~65ch.
- **Weights:** Use Medium (500) and SemiBold (600) for hierarchy.
- **Text wrap:** Use `text-wrap: balance` on headlines to avoid orphan words.

### Color and Surfaces
- **Pure `#000000` background:** Replace with off-black (`#0a0a0a` or `#090d16`).
- **Oversaturated accents:** Keep saturation < 80%.
- **Purple/blue "AI gradient" aesthetic:** Replace with neutral bases and a single considered accent color.
- **Depth & Imagery:** Add subtle noise, ambient gradients, or background images.

### Layout & Responsiveness
- **Break symmetry:** Use asymmetric grids, 2-column split-screen, or bento grids instead of 3 equal card rows.
- **Viewport stability:** Use `min-h-[100dvh]` instead of `h-screen` for hero sections.
- **Max-width container:** Max `1200-1400px` with auto margins.
- **Bottom-aligned CTAs:** Pin buttons to bottom of cards in grids so CTAs align horizontally.

### Interactivity & Feedback
- **Hover/Active states:** Add subtle `-translate-y-[1px]` or `scale-[0.98]` on click/press.
- **Skeletal Loaders:** Use layout-matching skeleton loaders instead of generic circular spinners.
