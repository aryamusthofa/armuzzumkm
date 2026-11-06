# IMPORTANT FIX — Handoff brief for Armuzz Studio (UMKM photo & video editing site)

You are continuing work on an existing static site. Read this file fully, then `myprompt.md`, `updatedprompt1.md`, `updatedprompt2.md` (original briefs), then inspect the repo. Do not rebuild blindly: check the **Progress checklist** at the bottom, verify each ticked item still works, and finish the unticked ones.

Repo: https://github.com/aryamusthofa/armuzzumkm · Live: https://aryamusthofa.github.io/armuzzumkm/
Stack: plain multi-page HTML + one CSS file + vanilla JS. No build step, no framework, no backend. Open with `python -m http.server 5500`.

## What the owner wants (final, in his words, translated)

- Planning is done; **execute everything**. Output must be clean, clear, simple, no filler.
- Serious, professional, ready for many real UMKM clients; but must look **original, natural, organic**, not generated "AI slop".
- Focus on **products and services**, transparent and firm. Not consultation-first.
- Ordering must be **flexible**: WhatsApp, Instagram DM, or TikTok DM, depending on the client. WhatsApp must not be required.
- Navbar must be a **horizontal side-scrolling strip** (swipe left/right), not a hamburger. Easy for non-technical customers who only want to order.
- **Mobile first, stable, perfect on phones.** Everything else is secondary.
- Owner edits only `assets/js/site-config.js` (data) and `assets/js/translations.js` (UI text). Indonesian is the default language; English stays fully supported.

## Audit findings that drove this work (all verified in headless Chromium at 320/360/390/412 px)

1. Hamburger panel rendered at x = −90…−109 px: all 9 links clipped on every phone width.
2. WhatsApp/email message was always English, even in Indonesian mode.
3. Internal service slug (`video-pendek`) was printed on service cards.
4. Tap targets too small: EN/ID buttons 30 px wide, text links ~22 px tall.
5. All 10 services had identical delivery/revision text ("agreed per project"): not transparent.
6. Developer notes leaked to customers (FAQ: "static site does not store orders", "prices are not official").
7. English prices used `$` while target audience is Singapore (S$); FAQ mentioned USD.
8. Portfolio was 8 tiny SVG illustrations, not real work.
9. GitHub link shown as a business social link; profile image `.png` was really WebP; duplicate eyebrow+h2 on contact page.
10. Everything rendered by JS only (blank if JS fails); no `noscript` fallback.
11. Design tells of generated sites: cream + Georgia serif + terracotta, ALL-CAPS tracked eyebrows, one italic accent word in the H1, `↗` appended to every link.
12. Live Pages deployment was older than the latest commit on `main` (check Settings → Pages → latest deploy).

No horizontal overflow and no console errors were found at 320–390 px before the rewrite. Keep it that way.

## Architecture decisions (do not undo without a reason)

- `assets/js/site-config.js` is the single source of truth: `demoMode`, `defaultLanguage`, `orderChannels`, `socialLinks`, `services` (price, days, revisions, what to bring), `packages`, `portfolio`, `faqs`.
- Prices: `idr` and `sgd` are **separate editable numbers**. Never convert one into the other. Indonesian pages show Rp, English pages show S$.
- `demoMode: true` shows a visible "sample prices/terms" note and sample portfolio items. Set it to `false` at launch: notes disappear and sample items are hidden (empty state invites the visitor to ask for examples by DM).
- `assets/js/components.js` injects the shared header (brand, language, theme, scrolling nav strip), footer and the mobile order bar. Each page keeps a `<noscript>` link list.
- `orderChannels` entries: `{ type: "whatsapp"|"instagram"|"tiktok"|"email", value }`. Only configured channels are shown.
  - WhatsApp: `https://wa.me/<digits>?text=<message>` (prefilled).
  - Email: `mailto:` with subject and body.
  - Instagram: `https://ig.me/m/<username>`; TikTok: `https://www.tiktok.com/@<username>`. These cannot prefill text, so the button **copies the brief to the clipboard, then opens the DM/profile**. Always show the brief in a visible box as a fallback if the clipboard is blocked.
- The order message is built from the visitor's current language.
- Themes: `warm-paper` (default), `deep-dark`, `clean-light`, `rgb-pulse`. Same token names in all four. RGB gradient is only for thin accents, never text or button fill.

## Design direction (keep)

- Type: one family, Plus Jakarta Sans (Google Fonts, `display=swap`, system fallback). Sentence case. No ALL-CAPS eyebrows, no italic accent word, no `↗` on links, no numbered markers unless content is a real sequence.
- Accent: ultramarine, not terracotta. Warm paper stays the default surface because the brief pinned it.
- The one memorable element: the **rate card**. Services are listed like a printed price list (name, dotted leader, "mulai dari" price, then days, revisions, what to bring), with an order button per row.
- Motion: only responses to user action. Respect `prefers-reduced-motion`.
- Touch targets ≥ 44 px. Headings must not push content below the fold on a 360 px phone.

## Rules that must not be broken

- No invented business facts: no fake testimonials, fake clients, fake ratings, fake counts, fake addresses, fake links. Missing channel = hidden, never `href="#"`.
- Demo prices/terms are labelled as demo while `demoMode` is true and must be approved by the owner before launch.
- No dark patterns: no countdowns, scarcity, forced popups, autoplay audio.
- Do not add a backend, database, CMS, payment or framework.
- Do not claim tests that were not run.

## How to test (use headless Chromium via Playwright)

- For each of the 9 pages at 320, 360, 390 px: `document.documentElement.scrollWidth === clientWidth`, no console errors, no failed requests.
- Nav strip: all links reachable by horizontal swipe, active tab visible, no vertical clipping.
- Interactive elements ≥ 44 × 44 px (report the offenders).
- Order flow in `id` and `en`: message text language matches, WhatsApp URL is encoded, IG/TikTok copy + open path works, brief box visible.
- Switch language and theme on every page; reload; both persist independently.
- Check every `data-i18n*` key and every `t("…")` call exists in both languages.
- Check contrast of text/background token pairs in all four themes (≥ 4.5:1 for body text).

## Still needs the owner (cannot be done by an agent)

- Real WhatsApp number, TikTok username, email (leave blank to hide).
- Approve or replace all demo prices, days, revisions, packages.
- Real portfolio media (photos, before/after, video MP4) in `assets/images/projects/` and `assets/video/`.
- Confirm business name and logo; add an `og:image` once a real image exists.
- Confirm GitHub Pages is deploying from `main`.

## Progress checklist

- [x] importantfix.md written
- [x] site-config.js rewritten (channels, rate-card data, demoMode)
- [x] translations.js rewritten (ID default, EN complete)
- [x] components.js (scrolling nav, footer, order bar)
- [x] main.js rewritten (order flow, rate card, packages, portfolio, faq)
- [x] style.css rewritten (4 themes, Plus Jakarta Sans, 44 px targets)
- [x] 9 HTML pages rebuilt with noscript fallback and Indonesian meta
- [x] Prompts moved to `docs/`, README rewritten (Indonesian)
- [x] Headless test report passes (see How to test)
- [x] Owner items listed above handed over
