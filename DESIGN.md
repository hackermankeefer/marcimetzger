---
name: real-estate-homepage-design
description: Design system for Marci Metzger’s premium real estate homepage
metadata:
  type: reference
---

# Design System – Marci Metzger Real Estate Homepage

## 🎨 Color Palette

| Role             | Value      | Usage Example                                         |
|------------------|------------|-------------------------------------------------------|
| Sand (Base)      | `#F4F1EC`  | Backgrounds, cards, negative space                    |
| Cream (Accent 1) | `#EAE3D2`  | Subdued backgrounds, section dividers                 |
| Charcoal (Text)  | `#2F2F2F`  | Body text, headings, borders                          |
| Accent (Single)  | `#D1A46D`  | Buttons, links, highlight bars, key actions           |

> ✅ No purple/cyan gradients — single accent color only.

## 🔤 Typography

| Element              | Font                        | Style Notes                                      |
|----------------------|-----------------------------|--------------------------------------------------|
| Headings (H1–H3)     | **Playfair Display** (serif)| Elegant, high‑contrast; import via Google Fonts  |
| Body / UI            | **Inter** (sans‑serif)      | Clean, modern; import via Google Fonts            |
| Buttons / Nav links  | **Inter** (sans‑serif)      | Consistent with body                              |

> ✅ Avoid emoji icons or decorative Unicode symbols.

## 🧱 Layout & Spacing

### Grid System
- **Desktop:** 1200px max-width container, 16px base spacing unit.
- **Tablet:** 768px breakpoints.
- **Mobile:** 320px breakpoints.
- No rigid card grids; use staggered vertical rhythm.

### Section Flow
1. **Hero** — Full-width desert hero image, centered headline.
2. **Quick Search** — Sticky form bar with input + button.
3. **Featured Listings** — Asymmetric staggered layout (desktop), vertical stack (mobile).
4. **About Marci** — Split layout: text left, image right (desktop); stacked (mobile).
5. **Testimonials** — Carousel-style quotes with subtle fade transitions.
6. **Contact Callout** — Dark charcoal background with accent CTA.
7. **Footer** — Minimal footer with logo, nav links, contact info.

## 📐 Components

### Button (Primary)
```css
.btn {
  background-color: var(--color-accent);
  color: var(--color-charcoal);
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  transition: opacity 0.2s ease;
}
.btn:hover { opacity: 0.85; }
```

### Card (Listing Preview)
- Background: `#FFFFFF`
- Border: `1px solid var(--color-cream)`
- Shadow: Subtle (`rgba(0,0,0,0.05)`)
- Image aspect ratio: `16 / 9`

## 🖼️ Imagery Guidelines
- Hero image: Desert landscape or Marci in front of a luxury listing.
- Use `object-fit: cover` for consistent thumbnails.
- Alt text should include property location or subject name.

## 🧭 Accessibility Notes
- All images have descriptive alt attributes.
- Color contrast > 4.5:1 against backgrounds.
- Keyboard navigable skip link at top of page.

## 🧪 Verification Checklist (after build)
- [ ] Matches described palette and typography
- [ ] Hero image loads and displays correctly
- [ ] Listings appear staggered, not grid-aligned
- [ ] Mobile layout stacks sections vertically
- [ ] No purple/cyan gradients present

---

**Why this system exists:** Centralizes visual decisions so code stays consistent and scalable.  
**How to apply:** Share with developers and designers before starting UI work.
