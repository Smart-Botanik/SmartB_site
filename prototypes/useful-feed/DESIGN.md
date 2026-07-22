---
name: Verdant Growth
colors:
  surface: '#f9faf2'
  surface-dim: '#d9dbd3'
  surface-bright: '#f9faf2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4ed'
  surface-container: '#edefe7'
  surface-container-high: '#e7e9e1'
  surface-container-highest: '#e2e3dc'
  on-surface: '#191c18'
  on-surface-variant: '#42493e'
  inverse-surface: '#2e312c'
  inverse-on-surface: '#f0f1ea'
  outline: '#72796e'
  outline-variant: '#c2c9bb'
  surface-tint: '#3b6934'
  primary: '#154212'
  on-primary: '#ffffff'
  primary-container: '#2d5a27'
  on-primary-container: '#9dd090'
  inverse-primary: '#a1d494'
  secondary: '#4b6542'
  on-secondary: '#ffffff'
  secondary-container: '#cae9bc'
  on-secondary-container: '#4f6a46'
  tertiary: '#363b31'
  on-tertiary: '#ffffff'
  tertiary-container: '#4c5247'
  on-tertiary-container: '#bfc5b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bcf0ae'
  primary-fixed-dim: '#a1d494'
  on-primary-fixed: '#002201'
  on-primary-fixed-variant: '#23501e'
  secondary-fixed: '#cdebbe'
  secondary-fixed-dim: '#b1cfa4'
  on-secondary-fixed: '#092005'
  on-secondary-fixed-variant: '#344d2c'
  tertiary-fixed: '#dfe4d7'
  tertiary-fixed-dim: '#c3c8bb'
  on-tertiary-fixed: '#181d15'
  on-tertiary-fixed-variant: '#43483e'
  background: '#f9faf2'
  on-background: '#191c18'
  surface-variant: '#e2e3dc'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1280px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system is centered on a "Digital Conservatory" aesthetic—merging the precision of modern agricultural technology with the organic warmth of a thriving indoor garden. The brand personality is nurturing, expert, and communal, designed to evoke a sense of calm productivity and environmental stewardship.

The design style utilizes **Modern Minimalism with Tactile Softness**. It relies on generous whitespace (breathing room for plant photography), soft-touch UI elements, and a high-contrast relationship between deep botanical greens and off-white "linen" surfaces. The visual narrative prioritizes clarity and high-quality imagery of flora, ensuring the interface serves as a sophisticated frame for organic content.

## Colors
The palette is rooted in a triadic harmony of greens. **Deep Forest Green** (#2D5A27) is the primary anchor, used for high-level branding, primary actions, and navigational states. **Soft Sage** serves as an accent for secondary interactions and subtle highlights. 

The background uses a warm **Off-White** (#F9FBF8) to reduce eye strain compared to pure white, while white is reserved for **Card Containers** to create clear content separation. For the 'Plant Stage' badges, a naturalistic spectrum is employed: bright lime for Seedlings, deep emerald for Vegetative, warm amber for Flowering, and earthy brown for Harvest.

## Typography
The system uses a pairing of two contemporary sans-serifs. **Plus Jakarta Sans** provides a friendly, slightly rounded geometric structure for headlines, echoing the organic curves of the UI. **Be Vietnam Pro** is used for body copy and metadata; its clean, professional apertures ensure high legibility for botanical data and long-form community posts. 

Tighten letter-spacing on larger displays for a more "editorial" feel. For mobile, headline sizes are scaled down to ensure content-first density in the social feed.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a maximum container width of 1280px for desktop. It uses a 4px base unit to maintain a rigorous but flexible spacing rhythm. 

- **Feed View:** Uses a single-column layout on mobile (16px margins) and a multi-column masonry or 12-column grid on desktop.
- **Card Spacing:** Internal padding for cards is set to `lg` (24px) to ensure a premium, airy feel.
- **Sectioning:** Vertical rhythm between different feed items is maintained at `xl` (40px) to prevent visual clutter and give each community contribution its own stage.

## Elevation & Depth
This design system avoids harsh, heavy shadows in favor of **Ambient Tonal Layers**. 

Hierarchy is established through:
- **Level 0 (Background):** The soft off-white base layer.
- **Level 1 (Cards):** Pure white surfaces with a very soft, diffused shadow (0px 4px 20px, 4% opacity of the primary forest green).
- **Level 2 (Modals/Popovers):** Higher elevation with a slightly more defined shadow and a 1px soft sage border (#E8EDDF) to ensure separation from the card layer.

Interactive elements like buttons should feel "pressed" rather than "elevated" to maintain the tactile, organic theme.

## Shapes
The shape language is defined by significant **Roundedness**. All standard container elements (cards, input fields) utilize a 16px (1rem) corner radius to mirror the soft edges found in nature.

- **Pill Shapes:** Specifically reserved for tags, badges (Plant Stages), and primary toggle buttons.
- **Circle Shapes:** Used exclusively for user avatars and icon buttons to provide a distinct visual contrast against rectangular card content.

## Components
- **Feed Cards:** Must feature a top-aligned image area with a 16px corner radius. Content below includes title-md for headlines and body-sm for descriptions.
- **Plant Stage Badges:** Pill-shaped, using a 10% opacity background of the status color with 100% opacity text of the same color for a "tinted glass" effect.
- **Buttons:** 
  - *Primary:* Forest Green background, White text, 16px roundedness.
  - *Secondary:* Sage Green background (20% opacity), Forest Green text.
- **Input Fields:** Soft beige backgrounds with no border in resting state; 2px forest green border on focus.
- **Growth Timeline:** A custom vertical list component using thin forest green lines and circular nodes to track plant milestones.
- **Social Interactions:** Inline icons for "Growth Support" (Like) and "Comment" using thin-stroke (1.5pt) iconography to keep the UI lightweight.