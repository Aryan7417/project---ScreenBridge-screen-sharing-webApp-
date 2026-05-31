---
name: Aetheric Luminescence
colors:
  surface: '#0c1324'
  surface-dim: '#0c1324'
  surface-bright: '#33394c'
  surface-container-lowest: '#070d1f'
  surface-container-low: '#151b2d'
  surface-container: '#191f31'
  surface-container-high: '#23293c'
  surface-container-highest: '#2e3447'
  on-surface: '#dce1fb'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dce1fb'
  inverse-on-surface: '#2a3043'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#89ceff'
  on-tertiary: '#00344d'
  tertiary-container: '#009ada'
  on-tertiary-container: '#002d43'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#0c1324'
  on-background: '#dce1fb'
  surface-variant: '#2e3447'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 80px
  margin-tablet: 40px
  margin-mobile: 20px
---

## Brand & Style

The design system is engineered for **ScreenBridge**, a premium SaaS platform that bridges the gap between hardware and software through seamless connectivity. The brand personality is **futuristic, precise, and authoritative**, evoking a sense of "technological magic" where complexity is masked by effortless elegance.

The visual style is a fusion of **Glassmorphism** and **Cyber-Minimalism**. It draws heavy inspiration from high-end workstation OS aesthetics (Apple/Linear), utilizing ultra-dark canvases contrasted against vibrant, luminous accents. The goal is to create an interface that feels like a physical light-table: deep, layered, and reactive.

**Key Visual Principles:**
- **Atmospheric Depth:** Using transparency and blur to create a multi-layered workspace.
- **Luminescent Signal:** Using color not just for decoration, but as a "pulse" that indicates active connections and data flow.
- **Technical Precision:** Tight margins and sharp typography to convey low-latency reliability.

## Colors

The palette is built on an **Ultra-Dark foundation** to maximize the "glow" effect of functional elements. The background is a singular, deep obsidian (#020617), which serves as the void for glass layers to float within.

- **Primary (Electric Blue):** Used for primary actions, active connection states, and critical paths.
- **Secondary (Vibrant Violet):** Used for data visualization, creative features, and subtle brand accents.
- **Gradients:** Transitions between Blue and Purple should be used sparingly for high-impact areas like hero headers or premium "Pro" feature cards.
- **Transparency:** Surfaces are rarely solid; they use an 8-bit alpha channel to allow background textures or glowing elements to bleed through.

## Typography

This design system utilizes **Geist** for its neutral, technical, yet sophisticated character. It provides the "developer-grade" precision required for a high-tech SaaS.

**Type Roles:**
- **Display & Headlines:** High contrast weight (Bold/SemiBold) with negative letter spacing for a compact, "engraved" look.
- **Body:** Regular weight with generous line height to ensure legibility against dark backgrounds.
- **Labels & Metadata:** **JetBrains Mono** is introduced for technical metadata, status badges, and code snippets, reinforcing the "ScreenBridge" focus on tech-forward infrastructure. 

Always use white (#FFFFFF) for primary text and a reduced opacity (60-70%) for secondary information to maintain hierarchy without introducing muddy grays.

## Layout & Spacing

The layout utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The spacing philosophy is based on a **4px baseline grid**, ensuring that every element—from icon padding to container margins—is a multiple of 4.

**Desktop:** Fixed-width container at 1440px centered in the viewport, or fluid 100% width for dashboard views with 80px side margins.
**Visual Breath:** Use whitespace (or "darkspace") aggressively. Large components should be separated by at least 48px to allow their outer glows to dissipate naturally without overlapping.

## Elevation & Depth

Hierarchy is defined through **Tonal Stacking** and **Backdrop Blurs** rather than traditional drop shadows.

- **Level 0 (Base):** #020617 (Obsidian).
- **Level 1 (Cards/Panels):** Surface color at 40% opacity with a 20px `backdrop-filter: blur()`. A subtle 1px inner stroke (White at 10% opacity) defines the edges.
- **Level 2 (Floating Modals/Popovers):** Higher opacity surface (60%) with a vibrant "glow" shadow. The shadow should use the primary color (#3B82F6) at 15% opacity with a 40px spread to simulate light emission.
- **Interactive States:** When hovering over a glass card, increase the inner stroke opacity and add a subtle 2px "Outer Glow" in the primary accent color.

## Shapes

The shape language is **Structured & Refined**. We avoid fully round "organic" shapes in favor of precise, geometric corners that feel engineered.

- **Standard Elements:** 0.5rem (8px) for buttons, input fields, and small tags.
- **Containers:** 1rem (16px) for main dashboard cards and layout sections.
- **Status Indicators:** Small circles are allowed for "Online/Live" status pulses to differentiate them from functional UI buttons.

## Components

### Buttons
- **Primary:** Solid Electric Blue gradient with a soft outer glow. Text is bold and high-contrast.
- **Ghost:** Transparent background with the "Level 1" border style. On hover, the background fills with a 10% primary tint.

### Floating Glass Cards
- These are the signature element. Every card must have `backdrop-filter: blur(12px)` and a thin gradient border (Top-left: White 20%, Bottom-right: White 5%).

### Input Fields
- Darker than the surface level to create an "inset" look. Use a JetBrains Mono font for typed text to emphasize the technical nature of the input.

### Chips & Badges
- Use a "Glass-Fill" style: Semi-transparent background with a solid-color left border (2px) to indicate category or status.

### Progress & Connectivity Bars
- Animated "pulse" effect moving through the gradient. Use a "glow" shadow that follows the progress head to simulate active data transmission.

### Icons
- Thin-stroke (1.5px) linear icons. Avoid filled icons unless used for active navigation states. Icons should be dual-tone, utilizing both Primary and Secondary accents.