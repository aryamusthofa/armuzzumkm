# UPDATED PROMPT 1 — PRODUCT-FOCUSED UMKM WEBSITE OVERHAUL

## Purpose and priority

This document is an **additional, high-priority revision brief** for the existing UMKM website project. Read it together with the original `myprompt.md` and the current project files.

The website has already been generated and has some working functionality. Do **not** treat this as a request to discard everything and blindly rebuild from scratch. First inspect the current implementation, understand what already works, identify what is missing, and then make a deliberate, comprehensive revision.

The most important change is the website's positioning:

> **This must be a product- and service-focused business showcase, not a consultation-first website or a personal-profile website.**

The business sells professional photo and video editing services. Customers should be able to see what the business offers, view convincing examples of the actual output, understand estimated prices, compare service options, and take the next step toward ordering. Personal biographies and consultation remain supporting information—not the main attraction.

Treat this as a real commercial freelance project that should be credible enough to present to a business owner and practical enough to use with real customers after the editable demo content has been replaced.

---

## 1. Audit the existing website before changing it

Start by reviewing the complete existing project, including all HTML pages, CSS, JavaScript, assets, content data, navigation, and any available documentation.

1. Identify the current page structure and the purpose of each page.
2. Find sections, controls, and calls to action that make the website feel too focused on consultation, personal introductions, or generic contact requests.
3. Identify existing functionality and design elements that are already useful. Preserve and improve them rather than removing them without a reason.
4. Check the supplied reference image named `IMG-20261026-WA0361.jpg`, when it is available in the project or attachments. Use it to understand the intended product/service presentation, information hierarchy, and pricing treatment. Do not assume details that cannot actually be seen. If the image is unavailable, continue using this written brief and the other project references; do not stop the work or pretend to have inspected it.
5. Create a practical revision plan, then implement the changes directly in the existing project.

Do not merely describe problems or provide recommendations. Fix them in the project files.

---

## 2. Reposition the website around services, packages, and finished work

The primary content should answer these customer questions quickly:

- What photo and video editing services can I order?
- What will the finished result look like?
- Which service or package suits my needs?
- What is the estimated price?
- What is included, and what should I prepare?
- How do I place an order or discuss a custom request?

The home page should communicate the business offer immediately. Within the first screen or two on a phone, visitors should be able to recognize the service category and reach the service catalogue, portfolio, or pricing.

Use a clear content hierarchy such as:

1. A concise business proposition and a strong primary action.
2. Featured services or packages.
3. Selected project results and visual examples.
4. A clear pricing or estimated-price section.
5. A simple ordering process and relevant trust information.
6. A secondary owner/business profile and social links.
7. A concise contact area and footer.

Adapt this hierarchy to the existing page structure. Do not force every item into one long page if separate pages make the experience clearer. Keep the overall project within the page-count and architecture direction established in `myprompt.md`.

**Consultation must not dominate the home page.** It can remain available as a secondary option for custom projects, complex briefs, or customers who need help choosing.

---

## 3. Make the service catalogue concrete and easy to browse

Present the business as a professional photo and video editing service provider.

### Video editing services

Include relevant service examples such as:

- Instagram Reels and short-form social videos.
- TikTok content.
- YouTube videos.
- Product videos and promotional advertisements for UMKM businesses.
- Cinematic edits.
- Event and documentation videos.

### Photo editing services

Include relevant service examples such as:

- Photo color grading and preset styling.
- Portrait and product retouching.
- Photo manipulation and compositing.
- Background removal.
- Instagram feed and visual-content preparation.

Organize services into meaningful categories. A visitor should understand the difference between each service without reading long paragraphs.

Each service or package should have useful, scannable information where applicable:

- Service/package name.
- A short outcome-focused description.
- Suitable use case or target customer.
- Example output or preview image/video.
- What is included and the expected deliverables.
- Estimated turnaround or delivery-time placeholder, if the owner has not supplied a confirmed timeframe.
- Revision allowance, clearly configurable and never exaggerated.
- Estimated price or price range.
- A direct, relevant order/contact action.

Do not invent guarantees, unlimited revisions, fixed turnaround promises, or capabilities that the business has not confirmed. Use clearly marked editable demo values where information is missing.

---

## 4. Make real-looking project results the main visual proof

The portfolio must showcase **finished outputs**, not just the people behind the business or abstract descriptions of the service.

Use dummy/demo projects where necessary. I will replace the demo content and media later. However, demo projects must be presented as editable sample content—not falsely represented as real client work, verified case studies, or actual customer endorsements.

Prioritize visual examples that demonstrate the services, such as:

- Short-form video editing results.
- Product advertisement edits.
- Cinematic video results.
- Event/documentation edits.
- Photo color-grading comparisons.
- Portrait or product retouching.
- Background-removal or manipulation examples.
- Instagram-feed visual arrangements.

Each project card should provide enough context to understand what is being demonstrated. Where appropriate, include:

- Project title.
- Service category.
- Short project description or creative objective.
- Preview image or video thumbnail.
- A playable video preview or a clear way to open the result.
- Before/after comparison for relevant photo-editing work.
- Deliverable format or platform (for example, Reels, TikTok, YouTube, or product advertisement).
- A project detail view with additional media and information, if useful.

Make portfolio browsing comfortable on mobile. Use consistent thumbnails, sensible image ratios, clear play indicators, and lightweight detail views. Do not autoplay videos with sound. Lazy-load large media and provide useful fallback states when an asset is unavailable.

Do not fill the portfolio with unrelated stock photos. Use relevant demo assets or clearly labelled replaceable media placeholders. Keep media paths and project data easy to update.

---

## 5. Add useful price estimates and editable pricing data

Pricing is an important part of this revision. Visitors should not have to contact the business just to understand whether a service is within their expected budget.

Create a clear pricing presentation inspired by the supplied reference image, where available. Show estimated prices or price ranges in a clean, readable format alongside the relevant service or package.

For each price, make the following clear:

- What service or package the estimate applies to.
- Whether the displayed amount is a starting price, an estimated range, or a custom quote.
- What is included in that estimate.
- Which factors may change the final price (for example, video duration, editing complexity, number of photos, source-material quality, deadline, or additional revisions).
- That the final quote is confirmed after the project requirements are understood.

### Pricing integrity and editability

- Put all package and pricing information in one clearly organized, easy-to-edit data/configuration file wherever practical.
- Use clearly identified **illustrative demo prices** if the business owner has not supplied approved rates. Make those values easy to replace and explicitly flag them in the README or configuration comments as requiring owner approval before publication.
- Never present invented demo prices as official, confirmed, guaranteed, or binding rates.
- Do not leave the pricing section empty simply because final prices have not yet been supplied. Use visibly identifiable editable sample values so the layout and customer journey can be tested.
- Keep the pricing structure flexible. The owner should be able to add, remove, rename, or change a service/package without editing many unrelated HTML files.

### Indonesia and Singapore pricing

The target audience includes customers in Indonesia and Singapore.

Prepare the pricing data so it can support Indonesian Rupiah (IDR / Rp) and Singapore Dollar (SGD / S$) where appropriate. Do not silently convert one currency into the other using an unverified or hard-coded exchange rate.

If actual SGD prices have not been supplied, make the SGD fields configurable and use a clear custom-quote state or an explicitly labelled demo value rather than implying that a conversion is official. Keep the currency treatment understandable and consistent across the site.

A simple market/currency choice may be added only if it improves clarity. Do not create a complicated selector that interrupts the customer journey.

---

## 6. Make ordering direct and practical

The website should help visitors move naturally from exploring a service to starting an order.

Use clear calls to action such as:

- View Services.
- View Projects.
- See Pricing.
- Order via WhatsApp.
- Request a Custom Quote.

The main action for a specific service/package should carry useful context into the contact flow. For example, a WhatsApp message can be prefilled with the selected service/package name and a short request for further details.

Keep the ordering process short and understandable. Do not force users through unnecessary consultation steps, account creation, multi-step forms, or checkout flows when a direct WhatsApp inquiry is more suitable for this business.

Where a form is retained, ask only for information that is genuinely useful. Use clear labels, helpful validation, understandable success/error feedback, and a reliable fallback contact method.

Do not invent a WhatsApp number, email address, or social-media URL. Put unknown details in a clearly marked configuration field or visible placeholder so I can replace them.

---

## 7. Add a complete English / Indonesian language switch

This is a **required feature**, not an optional enhancement.

The website targets Gen Z customers in Indonesia and Singapore. English must be the default language, while Indonesian must be available through a clearly visible language toggle.

### Language behavior

- Default to English (`EN`) on a visitor's first visit unless a previously selected language has been saved.
- Provide a simple, visible `EN | ID` or equivalent language switch in the desktop navigation and mobile navigation/header.
- Make switching languages immediate, smooth, and consistent without forcing a full page reload unless the existing architecture makes a reload genuinely necessary.
- Remember the visitor's selected language across page navigation and browser refreshes, preferably using `localStorage` with a safe fallback.
- If a saved language value is invalid or unavailable, fall back to English.
- Ensure direct access to an individual HTML page still initializes the correct language.

### Translate the complete user-facing experience

Both languages must be implemented throughout the entire website—not just the hero heading or navigation.

Include translations for:

- Navigation labels and page titles.
- Hero copy, buttons, headings, captions, and descriptions.
- Service categories and service/package details.
- Portfolio titles, categories, descriptions, and project-detail labels.
- Pricing labels, package inclusions, disclaimers, and quote explanations.
- Order steps and calls to action.
- Contact information labels and form fields.
- Form validation messages, confirmation messages, errors, empty states, and modal controls.
- Footer content, accessibility labels where applicable, and other visible interface text.

Do not leave a mixture of English and Indonesian after a language switch, except for proper brand names, product names, or terms that should remain unchanged.

### Implementation quality

- Keep translations in a centralized, maintainable dictionary/configuration structure rather than scattering language conditions across many files.
- Use stable translation keys and provide a sensible fallback for missing translations.
- Ensure dynamic content—such as service cards, portfolio data, pricing, modals, and generated WhatsApp messages—respects the selected language.
- Use natural, audience-appropriate English and Indonesian. Avoid awkward machine-translated wording, excessive slang, or overly formal copy that does not fit the brand.
- Keep the language toggle accessible, keyboard-operable, and easy to use with touch input.

English should feel natural to customers in Singapore and internationally. Indonesian should feel natural to Indonesian customers. Do not assume that Gen Z means using forced slang, excessive emojis, or trendy expressions everywhere.

---

## 8. Keep the owner profile secondary but complete

The business owner biography and social-media links are still important, but they must support the business rather than compete with the service catalogue and portfolio.

Keep a professional owner/about page or section that can include:

- Owner name and role.
- A concise, genuine introduction.
- Relevant skills or areas of specialization.
- The business's working approach and values.
- Social-media links and business contact channels.

Make this information editable. Do not invent qualifications, years of experience, awards, client history, or social accounts. Use clearly marked placeholders when details are unavailable.

The owner profile should reinforce credibility while keeping the main focus on the services and finished work.

---

## 9. Visual direction: product-first, modern, and human

Use the supplied image reference, the original `myprompt.md`, and the existing website as design inputs. Preserve what is useful, but revise the information hierarchy and presentation to match this updated business direction.

The desired result should be:

- Modern and visually appealing to Gen Z audiences in Indonesia and Singapore.
- Professional enough for a real commercial service business.
- Clear, direct, and visually led by service examples and finished project results.
- Comfortable to browse on ordinary Android phones and iPhones.
- Consistent across all pages and both languages.
- Distinctive without looking over-designed or generically AI-generated.

Use strong visual examples, clear section titles, concise copy, balanced spacing, readable typography, and consistent components. Avoid excessive text, decorative clutter, artificial urgency, unnecessary animations, and repetitive layouts.

Do not let the biography, consultation form, or decorative hero graphics take attention away from the actual services, packages, portfolio results, and pricing.

---

## 10. Technical implementation and maintainability

Continue to respect the existing project architecture and the original requirements in `myprompt.md`.

- Keep the site lightweight and mobile-first.
- Preserve the intended separate HTML page navigation and ensure direct page access works.
- Keep shared CSS and JavaScript organized and reusable.
- Use a centralized data source for services, packages, portfolio projects, pricing, business details, social links, and translations wherever practical.
- Avoid duplicating the same content across multiple pages.
- Ensure each page loads the shared styles, scripts, data, and language behavior correctly.
- Use semantic HTML and accessible controls.
- Optimize image/video loading and avoid unnecessary dependencies.
- Do not add a backend, database, authentication, CMS, or payment system unless it is genuinely required by the current project brief.

The project must remain understandable and manageable by me as the developer. Prefer straightforward, well-commented code over clever but difficult abstractions.

Provide or update an Indonesian-language README explaining:

1. The folder and file structure.
2. How to run the static website locally.
3. Where to edit service and package information.
4. Where to edit prices and currency values.
5. Where to replace portfolio images and videos.
6. Where to change business contact information and social-media links.
7. How to edit English and Indonesian translations.
8. How to add a new service, package, project, or page.
9. Any known limitations or values that must be confirmed before the website goes live.

---

## 11. Required quality assurance

Do not finish just because the pages render. Test the actual customer journey and the updated functionality.

At minimum, verify:

### Content and hierarchy
- The first impression clearly communicates the photo/video editing business.
- Services, packages, finished work, and pricing are more prominent than consultation or biography content.
- Demo projects and demo prices are clearly identifiable and easy to replace.
- No fake testimonials, client identities, credentials, statistics, or guarantees have been introduced.

### Language
- English is the first-visit default.
- The EN/ID toggle is visible and usable on desktop and mobile.
- All pages and all major interface states switch language correctly.
- The selected language persists across navigation and refreshes.
- Dynamic content and WhatsApp messages use the appropriate language.

### Customer journey
- Service and project cards lead to relevant details.
- Pricing is readable and understandable.
- Order/contact actions work and include the relevant service context where appropriate.
- Forms, validation, menus, modals, galleries, and media previews work correctly.
- No buttons or links are decorative controls that do nothing.

### Responsive behavior and performance
- Test realistic narrow Android and iPhone viewport sizes, as well as tablet and desktop layouts.
- Check for horizontal overflow, clipped content, overlapping elements, unreadable text, and difficult touch targets.
- Verify that large media does not make the site unnecessarily slow.
- Check browser console errors and fix issues that are within the project's scope.

Be honest about what was and was not tested. Do not claim device or browser testing that was not actually performed.

---

## 12. Final execution instructions

This is an implementation request, not a request for another proposal.

Make the necessary changes directly in the existing project. Do not stop after summarizing this brief, producing a checklist, or showing isolated code snippets.

Work independently and use sound engineering judgment. If minor details are missing, use clearly marked, editable placeholders and continue. Ask for clarification only when a missing detail makes a meaningful part of the implementation impossible.

Do not destroy existing useful work. Do not leave half-implemented sections, broken navigation, incomplete translations, empty pricing layouts, or nonfunctional controls.

When finished, provide:

1. The completed updated project files.
2. A concise summary of the most important improvements.
3. The pages and features changed.
4. The location of editable service, project, pricing, contact, and translation data.
5. A clear list of demo content or business details that I must replace or approve before going live.
6. A concise test report showing what was actually verified and any remaining limitations.

## Final acceptance criteria

The revised website is successful only when all of the following are true:

- It is clearly a **photo and video editing service showcase**, not a consultation-first landing page.
- Services and finished project results are central to the experience.
- Customers can browse examples and understand what they can order.
- Estimated prices are visible, useful, editable, and honestly labelled.
- English is the default language and Indonesian is fully supported through a working language toggle.
- Customers in Indonesia and Singapore can understand the content and contact the business without unnecessary friction.
- The website works smoothly on mobile and remains coherent on larger screens.
- The owner profile supports the business instead of overshadowing its products and services.
- The code and content are organized so I can confidently maintain and expand the website myself.

**Do not interpret this as a request to add more decoration. Interpret it as a clear change in business priorities: showcase the services, prove the quality through visible results, make pricing understandable, and make ordering easy—in both English and Indonesian. Deliver the strongest practical implementation you can within the existing project architecture.**
