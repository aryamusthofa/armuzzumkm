# UPDATED PROMPT 2 — FOUR-THEME SYSTEM, MOBILE PERFORMANCE & MOTION QUALITY

## Purpose and priority

This document is an additional implementation brief for the existing MSME website project. Read it together with `myprompt.md` and `updatedprompt1.md`.

The original project brief defines the overall business, architecture, and maintainability goals. `updatedprompt1.md` defines the revised product-first business direction, portfolio, pricing, and English/Indonesian experience. This document adds a clear requirement for a complete four-theme appearance system and a particularly polished, high-performance mobile experience.

Do not rebuild the project blindly. First inspect the current implementation, preserve useful working features and assets, and integrate these requirements into the existing architecture. Resolve conflicts by keeping the established business requirements while treating the four-theme system and the performance requirements below as additional mandatory requirements.

---

## 1. Implement four complete visual themes

Create a polished theme system with exactly four selectable themes. The themes must feel meaningfully different, but they must all belong to the same coherent brand. Changing a theme must change the visual presentation—not the website's content, information architecture, pricing, language, or functionality.

### Theme 1 — Warm Paper (Original Default)

This is the primary brand experience and the default theme for first-time visitors.

Design direction:
- Warm, creative, editorial, tactile, and welcoming—like a thoughtfully designed page on premium paper.
- Use a restrained palette inspired by warm ivory, soft cream, parchment, beige, muted earthy tones, and carefully chosen dark text.
- Use typography with personality while keeping body text highly readable on small screens.
- Introduce subtle paper-like character through restrained surfaces, borders, and small details. Avoid heavy textures, large image overlays, or visual noise.
- Make the presentation feel crafted and human rather than like a generic template.

This theme should feel distinctive, friendly, professional, and comfortable for extended browsing. It must remain the default unless the visitor has previously selected another theme.

### Theme 2 — Deep Dark

A genuinely comfortable dark appearance, not a simplistic color inversion.

Design direction:
- Use layered charcoal, graphite, and near-black surfaces rather than relying on pure black everywhere.
- Maintain clear text hierarchy, readable muted text, and carefully measured contrast.
- Use restrained accent colors and subtle surface separation.
- Keep cards, galleries, navigation, forms, pricing, and media controls visually coherent.
- Avoid excessive neon, bright outlines, and glowing effects.

The result should feel focused, premium, calm, and easy on the eyes in low-light environments.

### Theme 3 — Clean Light

A straightforward, minimal, bright theme for visitors who prefer clarity and simplicity.

Design direction:
- Use clean white and soft neutral surfaces with a restrained accent palette.
- Reduce decorative treatment and unnecessary visual complexity.
- Make headings, descriptions, service options, pricing, and calls to action easy to scan.
- Use whitespace deliberately, without creating excessive empty areas or making customers scroll unnecessarily.
- Keep borders, dividers, and shadows subtle and functional.

The result should feel direct, fresh, lightweight, and immediately understandable.

### Theme 4 — RGB Pulse

A modern, expressive option for visitors who enjoy a more colorful and experimental appearance.

Design direction:
- Use carefully controlled RGB-inspired accents, color transitions, and occasional gradient highlights.
- Keep the overall interface composed, polished, and readable.
- Apply colorful effects selectively to accents, selected controls, small highlights, and a few intentional interactive details.
- Do not cover every surface with gradients or animated colors.
- Avoid aggressive neon, flashing, strobing, excessive glow, particle effects, and distracting motion.
- Keep text contrast and the visual hierarchy as strong as in the other themes.

RGB Pulse must still feel soft-spoken, smooth, and tasteful—not loud, chaotic, or tiring. Its personality should come from controlled color accents, not from constant animation.

---

## 2. Theme system behavior and implementation

The four themes must be fully implemented and usable across every page, including the home page, service pages, portfolio pages, pricing sections, owner biography/link-in-bio page, contact areas, navigation, forms, modals, galleries, and footers.

Functional requirements:
- Provide one clear, accessible theme selector that is easy to find but does not clutter the interface.
- Display all four theme names clearly. Use small previews or swatches where they improve recognition without making the selector bulky.
- The selector must work with mouse, keyboard, touch, and screen readers.
- Apply a theme immediately without requiring a page reload.
- Preserve the visitor's selection when navigating between pages and when returning to the website.
- Use `Warm Paper` as the first-visit default. Do not let the operating system's dark-mode preference silently replace this explicit default.
- Store the selected theme safely, preferably with `localStorage`, and gracefully fall back to `Warm Paper` if storage is unavailable or contains an invalid value.
- Keep theme selection independent from the English/Indonesian language selection. Changing one must never reset the other.
- Make sure every page initializes the same theme consistently and does not briefly flash the wrong theme during loading.
- Update relevant browser UI colors, such as the mobile browser theme color, when practical and supported.
- Do not create separate duplicated HTML pages for each theme. Use one shared design system and theme tokens.

Recommended implementation approach:
- Define design tokens with CSS custom properties, such as page background, surface, elevated surface, primary text, muted text, border, accent, button, focus ring, and shadow.
- Implement the themes using a single root attribute or class, for example `data-theme="warm-paper"`, `data-theme="deep-dark"`, `data-theme="clean-light"`, and `data-theme="rgb-pulse"`.
- Keep the theme definitions in one clearly named shared stylesheet or one clearly organized theme section.
- Put theme selection and persistence logic in a shared JavaScript file, such as `assets/js/theme.js`, and load it consistently on every page.
- Initialize the stored theme as early as reasonably possible to prevent a flash of the wrong theme. Keep the initialization small, safe, and documented.
- Avoid hardcoding theme-specific colors throughout individual page stylesheets. Components should consume the shared design tokens.
- Ensure images, SVG icons, logos, form controls, borders, overlays, shadows, and third-party embeds remain visually appropriate in every theme.

The theme selector itself must also look correct in all four themes. Do not let the RGB theme make the selector unusable or the Clean Light theme erase its visual boundaries.

---

## 3. Preserve one consistent brand across themes

Themes are presentation choices, not four separate website designs.

Keep these elements consistent:
- Page structure and information hierarchy.
- Navigation labels and destinations.
- Business identity and logo usage.
- Service descriptions and package details.
- Portfolio content and project information.
- Pricing values and pricing logic.
- English and Indonesian translations.
- WhatsApp ordering and contact behavior.
- Accessibility and interaction behavior.

Allow each theme to adjust surface colors, typography treatments, borders, shadows, accent colors, and selected decorative details. Do not move important content, hide business information, change calls to action, or alter functionality just because a visitor selected a different theme.

Do not use a theme as an excuse to reduce contrast, reduce font size, hide labels, or make important actions harder to notice.

---

## 4. Mobile-first experience — Android is the primary optimization target

Treat mobile usability as a core product requirement, not a responsive afterthought.

Prioritize real-world Android phone usage, while maintaining excellent support for iOS Safari, tablets, laptops, and desktop browsers.

Review and optimize:
- Common narrow Android viewport widths and different screen densities.
- Portrait and landscape layouts where relevant.
- Touch target sizes and spacing between controls.
- Readability, line length, text scaling, and visual hierarchy.
- Header, navigation, theme selector, language selector, and mobile menu behavior.
- Sticky elements and bottom navigation, ensuring that they never cover important content or controls.
- Safe-area insets where relevant.
- Image and video sizing, loading, and playback controls.
- Modals, galleries, comparison sliders, forms, and interactive details.
- Browser back/forward navigation and direct loading of individual HTML pages.

Avoid horizontal overflow, clipped content, overlapping controls, tiny tap targets, accidental taps, excessive scrolling, and unnecessary interaction steps.

The experience must remain responsive and comfortable on ordinary Android devices with modest hardware. Do not optimize only for flagship phones or desktop previews.

---

## 5. Smooth scrolling, animation, and high-refresh display support

I want the website to feel exceptionally smooth: scrolling, transitions, hover/touch feedback, navigation, gallery interactions, page changes, and small interface responses should feel controlled and fluid.

Aim for a polished high-refresh-rate experience on devices and browsers that support it, including 90 Hz and 120 Hz displays. However, do not hardcode or promise a guaranteed 120 FPS on every device. Actual frame rate depends on the screen refresh rate, hardware, browser, operating system, thermal state, and workload.

Use these practical performance goals:
- Maintain stable, responsive behavior on ordinary 60 Hz devices as a baseline.
- Allow animations and scrolling to take advantage of 90 Hz or 120 Hz refresh rates when the browser and device support them.
- Avoid frame drops, stuttering, delayed input response, scroll jank, and unnecessary blocking work.
- Keep animations short and purposeful. Motion should feel soft-spoken, natural, and smooth rather than dramatic or constantly active.
- Prefer native browser scrolling. Do not hijack, lock, or replace ordinary page scrolling without a compelling functional reason.
- Never make essential information or navigation dependent on an animation finishing.

Implementation guidance:
- Prefer efficient CSS animations using `transform` and `opacity` when appropriate.
- Avoid repeatedly animating layout-triggering properties such as large changes to `width`, `height`, `top`, `left`, or layout spacing.
- Use `IntersectionObserver` for scroll-triggered reveals and lazy loading where appropriate instead of expensive continuous scroll calculations.
- Use passive event listeners for scroll and touch listeners when the event does not need to prevent the browser's default behavior.
- Use `requestAnimationFrame` for necessary JavaScript-driven visual updates, and avoid running expensive work on every scroll event.
- Avoid layout thrashing caused by repeatedly mixing DOM measurements and style writes.
- Do not apply `will-change` indiscriminately to every element.
- Avoid continuous animated backgrounds, large animated blurs, heavy backdrop filters, excessive box shadows, particle systems, and full-screen effects that waste mobile GPU resources.
- Use lazy loading, responsive images, appropriate image dimensions, and modern image formats when supported.
- Prevent layout shifts by reserving image and media dimensions before content loads.
- Keep JavaScript execution lightweight and avoid unnecessary timers, repeated DOM queries, and duplicated event listeners.
- Respect `prefers-reduced-motion`. Provide reduced or disabled nonessential motion without removing functionality.
- Do not autoplay sound. Any sound effect must remain optional, user-controlled, and off by default.

Do not add animations merely to demonstrate technical ability. Every motion detail must improve feedback, orientation, continuity, or the overall feeling of quality.

---

## 6. Theme-aware motion and interaction design

All four themes must share the same motion principles and interaction quality.

- Warm Paper: gentle, tactile, and natural transitions; restrained editorial details.
- Deep Dark: calm, controlled transitions; no excessive glow or high-contrast flashing.
- Clean Light: crisp, minimal feedback; no unnecessary decorative motion.
- RGB Pulse: slightly more expressive accent transitions, but no constant color cycling or aggressive effects.

Keep button feedback, focus states, loading indicators, menus, galleries, modals, and page transitions consistent in timing and behavior. Avoid making one theme noticeably slower or heavier than another.

Provide clear visual feedback for selected theme, selected language, active navigation, loading, success, validation errors, and disabled states. Do not rely on color alone to communicate a state.

---

## 7. Accessibility and comfort

For every theme:
- Maintain readable text and sufficient contrast for normal text, large text, icons, borders, and controls.
- Keep visible keyboard focus indicators.
- Provide accessible names and labels for theme controls and icon-only buttons.
- Support keyboard navigation and touch interaction.
- Respect browser zoom and user text-size preferences.
- Avoid flashing, strobing, or rapidly alternating color effects.
- Respect reduced-motion preferences.
- Ensure that selected, focused, disabled, success, and error states remain distinguishable.

Do not sacrifice accessibility for a particular aesthetic.

---

## 8. Testing and quality assurance

Do not consider the theme system complete merely because the selector changes the page background.

Test all four themes across all important pages and major components.

Verify that:
1. `Warm Paper` is used on a genuine first visit.
2. Selecting another theme updates the interface immediately.
3. The selected theme remains consistent when navigating between HTML pages.
4. The selection persists after refresh and on a later visit where browser storage is available.
5. Invalid or unavailable stored values fall back safely to `Warm Paper`.
6. Language switching works independently and remains correct after changing themes.
7. Text, buttons, cards, pricing, navigation, forms, modals, galleries, and media controls are readable in all themes.
8. There are no hardcoded colors that accidentally break a theme.
9. No page briefly flashes an incorrect theme during initialization, to the extent supported by the current architecture.
10. Theme selection is usable on touchscreens, with a keyboard, and by assistive technology.
11. Layouts remain correct on narrow Android screens and iOS Safari.
12. Scrolling, menus, galleries, transitions, and other interactions remain smooth without unnecessary GPU or CPU overhead.
13. Reduced-motion settings are respected.
14. No new console errors, broken links, duplicate event listeners, or regressions are introduced.

Test performance honestly. If you have access to browser developer tools or device testing, inspect runtime behavior and frame performance on representative devices. Do not claim that 120 FPS has been achieved unless it has been measured on a device and display capable of it. If physical-device testing is unavailable, state that limitation and perform the best available responsive and code-level checks.

Fix the issues you discover rather than only listing them.

---

## 9. Developer maintainability and handover

I will maintain and develop this website myself, so the implementation must remain easy to understand and modify.

- Keep theme tokens centralized and clearly named.
- Keep theme initialization and persistence logic in one shared location.
- Avoid duplicating theme styles across pages.
- Make it straightforward to adjust each theme's palette without hunting through unrelated files.
- Document how to add or modify theme tokens and how the selected theme is saved.
- Document any browser or device limitations relevant to high-refresh-rate animations.
- Keep the existing project architecture as simple as reasonably possible.
- Do not introduce a framework, dependency, backend, or build system solely to implement theme switching.

Update the Indonesian-language README with the four theme names, their visual purposes, how to change their colors, how persistence works, and how to test the experience.

---

## 10. Final execution instruction

Integrate this complete four-theme and mobile-performance system into the existing website. Do not provide only a design proposal, color palette, screenshot, or isolated code snippet.

Inspect the current project, implement the shared theme architecture, apply all four themes consistently to every page and component, optimize the mobile experience, and test the results.

The final result must feel like one carefully designed professional MSME platform with four genuinely usable visual personalities—not four disconnected templates.

The overall experience should remain:
- Human, warm, and thoughtfully designed.
- Professional and commercially credible.
- Simple and comfortable for customers.
- Fast and lightweight on Android.
- Smooth on high-refresh-rate displays where supported.
- Accessible and readable in every theme.
- Easy for me to maintain, customize, and expand.

Use strong engineering judgment. Prioritize actual usability, stability, and measured performance over decorative effects or unrealistic FPS claims.

**Implement the complete feature in the existing project, verify it as thoroughly as the environment allows, fix regressions, and clearly report what was completed and what could not be tested.**
