# MASTER PROMPT — HUMAN-CENTERED UMKM PHOTO & VIDEO EDITING WEBSITE

> **Purpose:** Give this entire prompt to an AI coding agent that has access to the project workspace and the reference files/URLs. The agent must inspect first, then build a complete, working, editable static website dump. Do not start by asking for more information unless a genuinely blocking issue prevents implementation.

---

## 1. Your Role and Mission

Act as a senior product designer, UX researcher, brand strategist, accessibility-minded frontend engineer, and practical technical mentor working as one capable delivery team.

Your task is to design and implement a polished, trustworthy, human-centered website ecosystem for a small Indonesian photo and video editing business (UMKM). The result must feel thoughtfully made by people for people—not like a generic AI-generated template, an overproduced agency landing page, or a collection of decorative effects.

The website must achieve four goals at the same time:

1. Help potential customers understand the editing services quickly and confidently.
2. Make it easy for customers to explore examples, understand the ordering process, and contact the business without unnecessary friction.
3. Give the business owner a professional online identity, biography, and social-media link hub.
4. Keep the source code sufficiently simple, organized, documented, and editable that a beginner-to-intermediate developer can understand, maintain, repair, and extend it independently.

**Do not optimize for visual impressiveness at the expense of clarity, usability, performance, trust, or maintainability.** Every major element must have a clear purpose.

---

## 2. Work Before You Code: Inspect the Existing Materials

Before changing or creating files:

1. Inspect the current workspace and identify its existing structure, files, dependencies, and entry points.
2. Read the supplied reference files if they are available:
   - `index (1).html` — a large editor/VFX portfolio reference with a dark interface, Inter and Space Grotesk typography, cyan accents, navigation, experience and testimonial sections, certificate displays, project galleries, media modals, and interactive viewers.
   - `style.css` — a separate dark visual system with green/mint accents, CSS variables, glass-style cards, navigation, hero layouts, gallery patterns, responsive rules, and subtle motion.
3. Treat those files as **reference material**, not as permission to copy all their code or complexity. Extract only design patterns and interactions that make sense for a small editing business. Do not carry over unrelated VFX features, oversized code, unnecessary effects, broken logic, or third-party content.
4. Inspect every reference URL below that is accessible. Understand its useful design, information architecture, interaction patterns, and implementation ideas. Do not blindly copy a site, its text, images, assets, or identity.
5. If a page or repository cannot be accessed, record that limitation briefly and continue using the other accessible references. Never claim to have inspected inaccessible content.
6. If an existing project already contains useful working code, preserve and improve it where reasonable instead of replacing everything without explanation.

### Reference learning materials

- Web 101 — Build Your Own Link in Bio: https://universal-magpie-c9c.notion.site/Web-101-Build-Your-Own-Link-in-Bio-3ef2eddec75280b9878bfc6368b08376
- Session 1 — How the Web Works, Tooling, and Semantic HTML: https://universal-magpie-c9c.notion.site/Pertemuan-1-Cara-Kerja-Web-Tooling-HTML-3ef2eddec75280c5907ee46cadec5f34?pvs=25
- Session 2 — Tailwind and Responsive Styling: https://universal-magpie-c9c.notion.site/Pertemuan-2-Tailwind-Dari-Polos-Jadi-Cantik-3ef2eddec75280c5afdecbc970250bd7?pvs=25
- Session 3 — JavaScript and the DOM: https://universal-magpie-c9c.notion.site/Pertemuan-3-JavaScript-DOM-3ef2eddec75280a381b6ec9dd1d6cfc9?pvs=25
- Session 4 — React Concepts, APIs, and Deployment: https://universal-magpie-c9c.notion.site/Pertemuan-4-Konsep-React-API-Deploy-3f02eddec752806c841ce4411d0801f5?pvs=25
- Software Development Team Workflow: https://universal-magpie-c9c.notion.site/Sharing-Session-Bagaimana-Sebuah-Tim-Software-Developer-Bekerja-di-Industri-3f12eddec75280c58815dfa85dc43483?pvs=25
- Web Development Cheat Sheet: https://universal-magpie-c9c.notion.site/Cheat-Sheet-3f12eddec7528045b072ce59fb8f8268?pvs=25

### Website and project references

- Owner profile / UMKM showcase reference: https://aryamusthofa.github.io/bioprofile/
- Existing developer website reference: https://armuzzdev.infinityfreeapp.com/
- Editor and VFX portfolio reference: https://renando.duingzcreative.site/#awards
- Cinematic portfolio guidance: https://www.duingzforge.site/learn/portfolio-sinematik-ai-copy-prompt
- Renando link-in-bio / social hub reference: https://duingzcreative.site/renando?utm_source=ig&utm_medium=social&utm_content=link_in_bio
- UMKM-style business and owner-profile example: https://fakhriamrullah1411-arch.github.io/webkulinerjapan/
- Related code examples:
  - https://github.com/Renando/testprto
  - https://github.com/Renando/BEM-Stikes
  - https://github.com/Renando/portfolio3
  - https://github.com/Renando/pww
  - https://github.com/aryamusthofa?tab=repositories
  - https://github.com/fakhriamrullah1411-arch/webkulinerjapan

### What to learn from the references

Use the course materials as a practical foundation:

- HTML5: semantic structure, accessible navigation, metadata, and SEO-friendly content.
- CSS: consistent design tokens, spacing, flexbox/grid, responsive layouts, readable typography, and restrained dark/light themes.
- JavaScript: DOM interaction, data-driven rendering, simple filters, state-based UI, and persistent preferences using `localStorage` where appropriate.
- React/API concepts: understand component reuse and state-driven rendering, but do not introduce a framework or backend unless the actual scope justifies it.
- Development workflow: organized files, Git-friendly structure, clear README, browser testing, and a realistic deployment path.

The owner-profile reference is particularly relevant for a personal profile, social links, theme controls, language controls, and a searchable link/showcase page. The UMKM example is useful for the relationship between a business landing page, owner biography, operating information, categories, and direct WhatsApp actions. The editor portfolio references are useful for presenting services and real work samples in a structured gallery.

---

## 3. Business Context and Brand Positioning

### Business category

A small business offering professional photo and video editing services for creators, individuals, brands, and UMKM sellers.

### Core value proposition

Help customers turn raw photos and video footage into clean, attractive, well-presented content that is ready to publish—without requiring the customer to learn editing software or spend their own time doing the work.

Use this positioning as the foundation, not as mandatory copy to repeat everywhere:

> Professional photo and video editing that makes your content look more polished, consistent, and ready to publish.

### Services that must be represented

**Video editing**

- Instagram Reels and short-form social videos.
- TikTok videos.
- YouTube videos.
- Product and promotional videos for UMKM businesses.
- Cinematic videos.
- Event and activity documentation edits.

**Photo editing**

- Color grading and preset-based adjustments.
- Photo retouching for people and products.
- Photo manipulation and compositing.
- Background removal.
- Instagram feed and visual-content arrangement.

### Customer-facing advantages

- Aesthetic, modern visual results that suit the intended audience and brand identity.
- Deadlines agreed upon before a project begins.
- A clearly agreed revision allowance so expectations remain fair to both sides.
- Flexible discussions about the customer's desired style, reference material, and deliverables.

Do not promise that content will automatically go viral, guarantee business growth, or claim results that cannot be proven.

### Suggested natural Indonesian messaging

Write the actual website copy in **natural, concise Indonesian** suitable for Indonesian customers. It should feel friendly, confident, and professional without sounding stiff, exaggerated, or artificially enthusiastic.

Possible messaging direction:

- “Konten lebih rapi, visual lebih menarik, siap dipublikasikan.”
- “Punya footage atau foto produk, tetapi belum sempat mengeditnya? Ceritakan kebutuhanmu—kami bantu rapikan sampai siap digunakan.”
- “Mulai dari video pendek sampai visual produk, sesuaikan hasil editing dengan kebutuhan konten dan identitas brand.”

You may improve the wording. Do not force these exact sentences onto every page. Use short headings, useful explanations, and clear labels. Avoid repetitive slogans, filler paragraphs, excessive exclamation marks, and generic AI-sounding phrases.

### Unknown business information

Some real business details have not yet been provided. Do not invent them. Examples include:

- Final business/studio name and logo.
- WhatsApp number, email, business address, and operating hours.
- Instagram, TikTok, YouTube, Facebook, and other social URLs.
- Exact package prices, delivery times, revision counts, and payment terms.
- Real portfolio items, client names, testimonials, certificates, and performance results.

Create one clearly organized configuration file for these values. Use unmistakable placeholders such as `YOUR_WHATSAPP_NUMBER`, `YOUR_INSTAGRAM_URL`, or `ADD_REAL_PORTFOLIO_ITEM`. Hide optional sections or show a discreet “coming soon / belum tersedia” state when no authentic data exists. Never publish fake links, fake proof, invented prices, invented addresses, fabricated reviews, or fictional staff members as if they were real.

If the profile owner is not otherwise configured in the project, use **Arya Musthofa Roja** as the editable default owner name, and make it easy to change in one place. Keep all other personal details editable and do not invent credentials or experience.

---

## 4. Product Scope: Build a 9-Page Multi-Page Website

Build **nine useful HTML pages**. Each page must be a real page with meaningful content—not merely a blank template or duplicate landing page.

1. `index.html` — **Home**
   - Clear hero statement explaining the editing service and who it helps.
   - One primary action leading to the contact/order flow.
   - A concise introduction to the most relevant services.
   - Selected real portfolio preview, if available.
   - A short “why work with us” section.
   - A simple ordering-process preview.
   - A natural final CTA.

2. `layanan.html` — **Services**
   - Separate photo and video editing categories.
   - Explain suitable use cases and typical deliverables.
   - Make it easy to identify which service fits a customer's needs.
   - Link each relevant service to the contact page with a prefilled inquiry option.

3. `portfolio.html` — **Portfolio / Work Samples**
   - Present real work samples in a clean, visual gallery.
   - Support useful categories such as Video, Product Ads, Social Media, Photo Editing, and Manipulation when there is enough data.
   - Include a lightweight detail view or modal only when it improves viewing.
   - Use optimized images and video embeds responsibly.
   - Do not use other creators' reference work as if it belonged to this business. Do not fabricate work samples. Make it easy to add new items from the central data file.

4. `paket.html` — **Packages / Pricing**
   - Explain how a quote is determined: editing complexity, duration, number of assets, desired output, and deadline.
   - Provide editable package structures if useful, but do not invent prices, turnaround promises, or revision quantities.
   - When actual prices are unavailable, use transparent wording such as “Hubungi untuk estimasi sesuai kebutuhan.”
   - Make inclusions, exclusions, and revision terms easy to understand once the owner supplies them.

5. `proses.html` — **How It Works**
   - Explain a simple flow: customer shares a brief and assets → style and scope are discussed → price and deadline are agreed → editing begins → preview/revision according to the agreement → final files are delivered.
   - Explain what customers should prepare (footage/photos, references, platform, aspect ratio, deadline, and preferred style).
   - Keep the process reassuring and short.

6. `tentang.html` — **About the Business**
   - Introduce the business and its approach to editing.
   - Explain its standards: clear communication, visual consistency, agreed deadlines, and fair revision terms.
   - Use a personal, credible tone rather than pretending to be a large agency.
   - Do not claim a team, years of experience, awards, or certifications unless verified.

7. `biodata.html` — **Owner Profile and Link-in-Bio**
   - This is a dedicated owner profile page, not just a short “About” section.
   - Take strong inspiration from the structure and experience of `https://aryamusthofa.github.io/bioprofile/` while adapting it to the editing-business identity.
   - Include the owner's photo/avatar area, name, role, concise biography, editing focus, skills/services, business identity, and relevant work/showcase links.
   - Include a well-organized social-media link hub: WhatsApp, Instagram, TikTok, YouTube, Facebook, and any other account actually configured.
   - Include a direct route back to the main business website and a clear contact action.
   - Keep the profile personal and credible; do not invent a long biography or professional achievements.
   - Consider a compact search/filter for profile links or showcased resources only if it genuinely improves navigation.
   - Provide tasteful theme options inspired by the reference (for example Light, Dark, and Warm). An RGB mode is optional and must remain restrained, readable, and comfortable—not flashing or neon-heavy.
   - An Indonesian/English switch is optional. If implemented, translate every visible label and relevant page copy consistently; do not provide a language toggle that only changes a few words. Indonesian must be the default.
   - Save theme preference with `localStorage` if practical, with a safe default when storage is unavailable.

8. `faq.html` — **Frequently Asked Questions**
   - Answer only questions supported by the business information or clearly marked policies.
   - Useful topics include how to order, file formats, required source footage/photos, revisions, deadlines, payment arrangements, and delivery.
   - Do not invent a payment policy, unlimited revisions, or guaranteed completion time. Keep unknown answers editable in the configuration.

9. `kontak.html` — **Contact / Order Inquiry**
   - Make the next step obvious and low-friction.
   - Provide a concise inquiry form or structured order brief with only useful fields (name, service type, desired platform/output, short description, and optional deadline/reference link).
   - The simplest reliable first-version behavior is to validate the fields and generate a prefilled WhatsApp message when a valid WhatsApp number is configured.
   - Be honest about form behavior. A static page must not pretend that it stores or sends a server-side order. If no backend exists, clearly use WhatsApp or another real configured contact destination.
   - Include direct social/contact links only when configured.

### Page navigation requirement

Use normal multi-page HTML navigation. For example:

```html
<a href="./biodata.html">Biodata Pemilik</a>
```

When clicked, the browser must open the actual `biodata.html` file in the same project structure, and that page must load its own CSS and JavaScript correctly. Apply this behavior consistently to all nine pages. Do not turn the site into a hash-only single-page mockup or a JavaScript-only routing simulation.

---

## 5. Human-Centered UX and Ethical Persuasion

Use psychology to reduce uncertainty and make decisions easier—not to pressure, trick, or manipulate visitors.

Build trust through:

- **Clarity:** visitors should understand the service, intended customer, next step, and important conditions quickly.
- **Cognitive ease:** concise copy, familiar labels, predictable navigation, readable sections, and a limited number of choices at a time.
- **Specificity:** explain what the service actually does rather than relying on empty words such as “best,” “number one,” or “world-class.”
- **Authentic evidence:** use real portfolio items and real testimonials only when supplied and approved.
- **Transparency:** explain what is included, what needs discussion, how revisions work, and how deadlines are agreed.
- **Autonomy:** let customers browse, compare, and contact the business at their own pace.
- **Reassurance:** tell customers what information to prepare and what happens after they make contact.
- **Consistency:** use one coherent brand voice, visual system, CTA language, and information structure across pages.

Use a clear primary CTA where appropriate, such as “Diskusikan kebutuhan editing” or “Konsultasi via WhatsApp.” Secondary actions should be visually quieter.

**Strictly avoid dark patterns:** no fake countdowns, fabricated scarcity, fake customer counts, fake star ratings, invented testimonials, misleading discounts, hidden fees, forced popups, disguised ads, deceptive opt-outs, autoplay audio, or aggressive repeated contact prompts. Never guilt-trip or pressure visitors. Persuasion must come from relevance, honesty, usefulness, and a frictionless experience.

---

## 6. Visual Direction: Modern, Gen-Z-Friendly, and Organic

The visual result should feel contemporary and polished, but not loud, childish, overly futuristic, or visually exhausting.

### Overall art direction

- Modern creative-studio identity with a clean editorial layout.
- Mobile-first responsive composition.
- A dark graphite/near-black foundation is acceptable and aligns with the supplied portfolio reference.
- Choose **one restrained accent palette** (for example mint/soft green or teal/cyan) and use it consistently. Do not mix every accent color from the reference files.
- Consider a light or warm theme on the owner profile page if it helps the profile feel welcoming.
- Use generous whitespace, balanced content width, clear hierarchy, and consistent spacing.
- Use readable typography. Inter and Space Grotesk are possible reference choices, but select fonts based on readability and ensure sensible fallbacks.
- Cards, borders, gradients, and glass effects must be subtle and purposeful.
- Use natural photography and genuine project visuals when supplied. Avoid generic AI-looking decorative imagery.

### Organic design rules

- No excessive neon glow, huge blurred blobs, constant background movement, random floating shapes, noisy particles, gratuitous 3D objects, or overdone glassmorphism.
- No decorative element should compete with the service, portfolio, or CTA.
- Avoid giant headings that push useful content below the fold on mobile.
- Avoid excessive card grids where a simple text section would be clearer.
- Prefer a small number of polished sections over a long page full of filler.
- Keep transitions short and subtle. Respect `prefers-reduced-motion`.
- Do not add a custom cursor, elaborate loading screen, or heavy animation unless it provides a genuine user benefit.

### Reference-specific design guidance

- From the supplied editor/VFX HTML: consider the dark editorial foundation, typography pairing, structured portfolio categories, lightweight media-detail interaction, and clear contact hierarchy.
- From the supplied CSS: consider the use of CSS variables, consistent components, responsive rules, and restrained mint/green accents.
- From the owner-profile reference: consider personal branding, profile identity, theme options, social links, link/showcase organization, and compact search/navigation.
- From the UMKM example: consider the practical relationship between the business landing page, owner profile, and direct ordering/contact action.

Adapt these patterns to the actual business. Do not reproduce another site's exact layout, content, branding, images, or code.

---

## 7. Technical Architecture: Simple, Structured, and Easy to Own

### Preferred implementation

Build a lightweight static multi-page site using:

- Semantic HTML5 for page structure.
- CSS3 for a shared design system and responsive layouts.
- Vanilla JavaScript for interactions and data-driven content.
- A small, centralized site configuration/data file for owner details, brand details, contact channels, social links, service descriptions, portfolio items, and FAQs.

Use Tailwind CSS only if it genuinely simplifies the implementation and is configured/documented appropriately. Do not add a complex build pipeline merely for appearance. Do not use a CDN-only framework dependency as a substitute for an organized production structure. React, Next.js, databases, APIs, authentication, and server frameworks are **not required** for this first static dump; introduce them only if there is a concrete feature that cannot reasonably be handled by the static version.

Do not add Python just to make the project look more advanced. This is primarily a static website. A Python backend is unnecessary. For local preview, document VS Code Live Server or the built-in command `python -m http.server 5500` as an optional way to serve the folder.

### Suggested folder structure

You may improve this structure if there is a clear reason, but keep it beginner-friendly and avoid needless abstraction:

```text
umkm-editing-studio/
├── index.html
├── layanan.html
├── portfolio.html
├── paket.html
├── proses.html
├── tentang.html
├── biodata.html
├── faq.html
├── kontak.html
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── site-config.js
│   │   ├── components.js
│   │   └── main.js
│   └── images/
│       ├── profile/
│       ├── portfolio/
│       └── general/
├── README.md
└── myprompt.md
```

Only create files that are actually used. If a separate page script or additional data file is useful, add it with a clear purpose and explain it in the README.

### Code organization rules

- Keep the shared stylesheet separate from HTML.
- Keep the editable brand/business data in one obvious place, such as `site-config.js`.
- Keep reusable navigation/footer patterns centralized where this can be done reliably without fragile dependencies.
- Keep page-specific interactions small and clearly named.
- Use descriptive file names, IDs, and class names.
- Use semantic elements and accessible form labels.
- Add short, useful comments in straightforward Indonesian where they help the owner understand what to edit.
- Avoid deeply nested abstractions, needless dependencies, minified source, giant single-file scripts, and clever code that is difficult for a beginner to maintain.
- Avoid duplicating long content across pages. Keep repeated business data in configuration wherever practical.
- Ensure scripts are loaded in the correct order and do not throw errors on pages that do not contain a given component.
- Use relative paths correctly so all HTML pages work when hosted from a subdirectory as well as at the domain root.
- Use `defer` or safe initialization so JavaScript does not run before the required DOM exists.
- Make the site usable even when optional images or social URLs are missing.

### Data configuration

Create a clearly documented configuration file containing editable values such as:

```js
window.SITE_CONFIG = {
  businessName: "YOUR_BUSINESS_NAME",
  ownerName: "Arya Musthofa Roja",
  ownerRole: "Owner & Photo/Video Editor",
  whatsappNumber: "YOUR_WHATSAPP_NUMBER",
  email: "YOUR_EMAIL",
  address: "",
  socialLinks: {
    instagram: "",
    tiktok: "",
    youtube: "",
    facebook: "",
    whatsapp: ""
  }
};
```

This is an example schema, not a requirement to copy blindly. Validate values before rendering links. Never leave fake `href="#"` links that appear functional. Hide an optional link when its destination has not been configured, or display a clearly marked owner-only placeholder in the documentation.

---

## 8. Functionality Requirements

Implement only interactions that are useful, reliable, and testable.

- Multi-page navigation among all nine HTML files.
- Responsive navigation menu for mobile with correct open/close behavior and accessible labels.
- Active navigation state where appropriate.
- Contact CTAs that lead to the contact page or a valid configured WhatsApp destination.
- A contact/order form that validates input and produces a readable, URL-encoded WhatsApp message when configured.
- Portfolio category filters only when there are enough real items to justify them.
- Portfolio image/video detail modal only when useful; support closing with a visible close control, backdrop click, and Escape key.
- Image loading should be optimized and include meaningful `alt` text.
- Theme switching on the owner-profile page if implemented; persist the user's selection safely.
- Search/filter controls only when they meaningfully help users find items.
- Accordion behavior for FAQs, with keyboard-accessible controls and correct expanded state.
- Clear empty states when optional content is absent.
- Buttons must perform the action their labels promise.

Do not create a fake cart, payment system, booking database, admin dashboard, authentication system, or server-side form submission in this static version.

---

## 9. Responsive Design, Accessibility, SEO, and Performance

### Responsive behavior

Design and test for:

- Small Android phones.
- Larger phones.
- Tablets.
- Desktop and wide screens.

Prioritize mobile usability because customers may arrive from Instagram, TikTok, or WhatsApp. Ensure buttons are easy to tap, navigation is predictable, text is readable, and no element creates horizontal overflow.

### Accessibility

- Use semantic headings in logical order.
- Provide visible keyboard focus styles.
- Add labels to inputs and accessible names to icon-only controls.
- Provide meaningful image alternative text; decorative images should use empty alt text.
- Ensure sufficient color contrast.
- Make dialogs and accordions keyboard accessible.
- Do not communicate important information through color alone.
- Respect reduced-motion preferences.

### SEO and sharing

- Give each page a unique, useful `<title>` and meta description in natural Indonesian.
- Use logical heading structure and descriptive link text.
- Add Open Graph metadata with editable values where appropriate.
- Add structured business data only when real business information is available. Do not invent addresses, ratings, opening hours, or contact details.
- Use a canonical URL only when the real deployment domain is known.
- Ensure social sharing previews do not contain placeholder text.

### Performance

- Keep JavaScript and CSS lightweight.
- Avoid unnecessary libraries and large icon/font packages.
- Use appropriately sized and compressed image assets.
- Use `loading="lazy"` for below-the-fold images where appropriate.
- Reserve image dimensions to reduce layout shift.
- Avoid autoplay media and heavy visual effects.
- Do not rely on remote assets that are likely to break without a local or graceful fallback.

---

## 10. First Delivery: A Complete, Local-First Website Dump

The immediate deliverable is a **complete and functional static website dump**, not a proposal, screenshot, wireframe, or partially implemented skeleton.

The first version must include:

1. All nine HTML pages with real page-specific structure and sensible Indonesian starter copy.
2. A consistent shared visual system.
3. Working links between pages, especially the route to `biodata.html` and back to `index.html`.
4. Working, tested JavaScript interactions that are in scope.
5. A centralized place to edit business information and social URLs.
6. Clear placeholders only for facts/assets that have not been supplied.
7. A useful `README.md` written in Indonesian.
8. This `myprompt.md` preserved in the project when the workspace allows it.

Do not stop after producing only the home page. Do not leave the other pages as “coming soon” shells. It is acceptable for real portfolio images, phone numbers, rates, or testimonials to remain unconfigured, but the layouts and empty states must still be complete and intentional.

### README requirements

Write a practical Indonesian README that explains:

- What the website contains.
- The purpose of each HTML page.
- The folder and file structure.
- Which file to edit to change the business name, owner profile, services, pricing, social media, WhatsApp number, portfolio, and FAQs.
- Where to place and how to replace images.
- How to preview the website locally using VS Code Live Server or `python -m http.server 5500`.
- How to deploy the static site to GitHub Pages or another static host.
- Known limitations of the static version and which future features would require a backend.

---

## 11. Quality Assurance: Verify Before Declaring Completion

Test the actual project in a browser or equivalent local preview. Do not claim that something works simply because the code was written.

At minimum, verify:

- Every one of the nine HTML pages opens.
- Every navigation link points to the correct `.html` file.
- The `biodata.html` page loads its stylesheet and JavaScript correctly.
- Links back to the home page work.
- There are no broken local CSS, JavaScript, or image paths.
- There are no fatal JavaScript console errors.
- The mobile navigation opens and closes correctly.
- The contact form validates and generates the correct WhatsApp message when a number is configured.
- Missing social links are handled safely and do not create broken anchors.
- Portfolio filters/modals and FAQ accordions work if included.
- Theme preferences persist if theme switching is included.
- The layout has no horizontal overflow at common mobile widths.
- Text, buttons, forms, and images remain readable and usable on mobile.
- Reduced-motion and keyboard interaction are respected.
- No fake testimonials, fake portfolio work, fake pricing, or fake business facts have slipped into the content.

If browser testing is not available in the environment, state exactly what was and was not tested. Do not invent test results.

---

## 12. Future Development: Keep the Foundation Expandable

The first dump should remain static and easy to maintain. Prepare the structure so it can later be extended gradually with features such as:

- A simple owner-only content management workflow.
- A real backend or database for persistent inquiries.
- A portfolio upload/update system.
- Analytics with appropriate privacy practices.
- A more advanced quote or order workflow.
- A framework migration only if the project's complexity genuinely grows.

Do not implement these future systems prematurely. Document them as optional next steps, not as unfinished features that block the current delivery.

---

## 13. How to Work and How to Report Back

Work autonomously and make sensible decisions within the requirements above. Do not keep asking the owner to choose tiny design details. When information is missing, use a neutral, clearly editable placeholder and continue. Ask only when a missing fact makes a correct implementation impossible.

Prioritize in this order:

1. Correct business purpose and clear content.
2. Working multi-page navigation and core interactions.
3. Readability, mobile usability, accessibility, and trust.
4. Maintainable structure and clear configuration.
5. Visual refinement and tasteful micro-interactions.
6. Optional enhancements.

When finished, provide a concise handoff in Indonesian with:

- What was implemented.
- The nine pages and their purpose.
- The most important files to edit.
- What real information/assets the owner still needs to fill in.
- How to run the project locally.
- What was tested and any remaining limitations.
- A short, practical next-development recommendation.

**Final standard:** The site should look professionally designed, feel natural to Indonesian customers, make contacting the business easy without pressure, and remain understandable to the developer who will own and maintain it. Build a genuinely useful small-business website—not a generic AI template.
