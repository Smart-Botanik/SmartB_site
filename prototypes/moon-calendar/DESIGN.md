---
name: Celestial Glass
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  gutter: 16px
  grid-cell: clamp(40px, 8vw, 64px)
---

## Brand & Style
The design system is engineered for high-fidelity astronomical and productivity applications. It evokes a sense of deep-space exploration and precision through a **Glassmorphic** lens. The brand personality is professional yet ethereal—balancing the vastness of the cosmos with the utility of a modern calendar.

The target audience includes astrology enthusiasts, night-sky observers, and professionals who appreciate high-contrast, immersive data visualization. The UI should feel like a pane of glass floating in the void, where light is used sparingly but purposefully to guide the user's eye.

## Colors
The palette is rooted in the "Midnight Blue" spectrum to maintain high visual comfort in low-light environments. 

- **Primary (Indigo):** Used for active dates, primary navigation, and "present moment" indicators. It carries a subtle outer glow (0px 0px 12px) to simulate a celestial body.
- **Secondary (Cyan):** Reserved for technical data—lunar phases, orbital paths, and atmospheric metrics.
- **Tertiary (Amber):** Used exclusively for solar events, equinoxes, or critical alerts, providing a warm contrast to the cold cosmic base.
- **Surface Strategy:** Layers use varying degrees of transparency. The base is a deep matte, while floating panels use a semi-transparent hex (#161F30) with a 70-80% opacity to allow background gradients to bleed through.

## Typography
This design system utilizes **Inter** for its neutral, highly legible character, ensuring that complex date grids remain readable. To enhance the "technical" feel, **Geist** (a monospaced-adjacent sans) is used for labels and astronomical data points.

- **Headlines:** Use tight tracking and heavy weights to ground the UI.
- **Data Points:** Coordinates, moon percentages, and timestamps should use `data-mono` to ensure numeric alignment in lists.
- **Hierarchy:** Use color (Neutral-400 vs White) rather than just size to distinguish between primary information and secondary metadata.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for the calendar view itself, transitioning to a **Fluid Grid** for the surrounding dashboard elements. 

- **Calendar Grid:** A strict 7-column layout. Each cell is a square aspect ratio to maintain visual balance.
- **Breakpoints:** 
  - **Mobile (<768px):** The calendar takes 100% width. Margins reduce to 16px. Sidebar collapses into a bottom sheet.
  - **Desktop (>1024px):** A 12-column structure where the calendar spans 8 columns and the "Lunar Details" inspector spans 4 columns on the right.
- **Rhythm:** All margins and paddings are multiples of 4px, creating a tight, engineered feel.

## Elevation & Depth
Depth is achieved through **Backdrop Filtration** rather than traditional heavy shadows.

- **Level 1 (Canvas):** The base background.
- **Level 2 (Glass Panel):** Semi-transparent cards with a `backdrop-filter: blur(12px)`. These panels have a 1px inner stroke using the `border_subtle` color to define their edges.
- **Level 3 (Interactive):** Hover states on calendar cells trigger a "glow" effect—a radial gradient background that expands from the cursor position.
- **Light Source:** Assume a distant light source from the top-center; apply a very subtle white-to-transparent linear gradient on the top 1px of borders.

## Shapes
The shape language is modern and approachable but retains its professional edge.

- **Standard Containers:** Use `rounded-lg` (1rem) to soften the technical nature of the data.
- **Interactive Elements:** Buttons and input fields use `rounded-lg`.
- **Indicators:** Lunar phase icons and status dots are perfect circles. 
- **Borders:** Always 1px. Avoid thick borders which disrupt the "glass" illusion.

## Components

### Buttons
- **Primary:** Solid `#6366F1` with white text. On hover, apply a box-shadow of `0 0 20px rgba(99, 102, 241, 0.4)`.
- **Ghost:** Transparent background with `border_subtle`. High-contrast text.

### Calendar Cells
- **Active Date:** Surrounded by a thin Indigo ring.
- **Current Phase:** A high-fidelity SVG of the moon phase centered in the cell, set to 40% opacity if it's not the current day.
- **Hover State:** Cell background shifts to `#2A364F` with a transition of 200ms.

### Cards (Glass Panels)
- Must include `backdrop-filter: blur(16px)` and a background color of `rgba(22, 31, 48, 0.7)`.
- Internal padding is strictly 24px for desktop, 16px for mobile.

### Inputs & Selectors
- Background should be a darker shade than the card (`#0B0F17`) to create a "recessed" look.
- Focus state: Border color changes to Cyan (`#06B6D4`) with a soft outer glow.

### Lunar Phase Tooltip
- A high-contrast popover containing specific illumination data. Uses the `data-mono` typography for all metrics.