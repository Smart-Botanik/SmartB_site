# Agent Coding Rules & Conventions

## Common Block Identification Classes

All top-level page section components ("Common Blocks") MUST include a specific identifying CSS class on their outer container element. This enables AI agents, automated tests, and developers to easily identify, select, and style individual UI components across the site.

### Naming Conventions & Required Classes for Common Blocks:

1. **Header Block (`SiteHeader`)**:
   - Class: `block-header`
   - Example: `<header className="block-header fixed top-0 z-50 ...">`

2. **Hero Section (`HomeHero`)**:
   - Class: `block-hero-section`
   - Example: `<section className="block-hero-section relative flex ...">`

3. **Culture Section (`HomeSidebarCultures` / `CulturePresentationBlock`)**:
   - Class: `block-culture-section` (sidebar) / `block-culture-presentation` (presentation block)
   - Example: `<aside className="block-culture-section lg:sticky ...">`

4. **Updates Section (`HomeLatest`)**:
   - Class: `block-updates-section`
   - Example: `<div className="block-updates-section glass-effect ...">`

5. **Lunar Calendar Section (`HomeLunarCalendar`)**:
   - Class: `block-lunar-calendar`
   - Example: `<div id="lunar-calendar" className="block-lunar-calendar glass-effect ...">`

6. **Knowledge Base Section (`HomeKnowledge`)**:
   - Class: `block-knowledge-section`
   - Example: `<div id="knowledge-base-section" className="block-knowledge-section glass-effect ...">`

7. **Diary CTA Section (`HomeDiaryCta`)**:
   - Class: `block-diary-cta`
   - Example: `<section className="block-diary-cta mx-auto max-w-container-max ...">`

8. **Footer Block (`SiteFooter`)**:
   - Class: `block-footer`
   - Example: `<footer className="block-footer mt-auto ...">`

### Rules for New & Modified Components:
- Any new top-level page section or major UI block component created MUST include a `block-<section-name>` identifying class on its root HTML element.
- When updating or refactoring existing top-level blocks, preserve or add the `block-*` identifying class on the root element of the component.

## Browser Checking Constraint

- Do NOT use the browser subagent (`browser_subagent`) or perform any manual/automated browser verification/checking.
- Tests will be run first before any browser-based verification is utilized.

