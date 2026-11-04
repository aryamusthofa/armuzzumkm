# Product & video editing studio website

A static, nine-page site centered on product and service showcases: photo/video editing services, illustrative project concepts, editable IDR/SGD sample estimates, FAQs, and a WhatsApp-ready project brief. English is the default language; visitors can switch between English and Bahasa Indonesia. Their selection is saved in browser storage.

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Product-led introduction, featured project concepts, services, and estimates |
| `layanan.html` | Photo and video editing services with sample estimate ranges |
| `portfolio.html` | Filterable project concepts and image/video detail dialog |
| `paket.html` | IDR and SGD estimate examples, clearly marked as editable samples |
| `proses.html` | Steps from project brief to delivery |
| `tentang.html` | Product-first editing approach and working principles |
| `biodata.html` | Secondary editor profile and profile links |
| `faq.html` | Answers about assets, revisions, prices, and output formats |
| `kontak.html` | Brief form that prepares a WhatsApp message when configured |

All pages use normal HTML links. Shared CSS and JavaScript live under `assets/`.

## Customize the site

Edit `assets/js/site-config.js`:

- `businessName`: set the studio/business name; leave empty to use a generic studio label.
- `ownerName`, `ownerRole`, and `ownerBio`: editor profile details.
- `ownerImage`: profile photo path.
- `businessDescription`: short description of the service.
- `contact.whatsappNumber`: international WhatsApp number, digits only with country code (for example `62812...`).
- `contact.email`: active email address, or empty.
- `socialLinks`: only add active, approved profile URLs. Empty URLs are hidden.
- `services`: bilingual service name, category, summary, and deliverable. The contact form options are generated from this list.
- `portfolio`: three bilingual concept placeholders are included, each with a matching SVG in `assets/images/projects/`. They are clearly marked as concepts—not completed client projects. Replace the title, category, description, image, alt text, and optional `video` path with approved project media. Leave `video` empty to show the image fallback. The dialog currently expects MP4 video.
- `pricing`: example price ranges in IDR and SGD. These are illustrative placeholders, not approved rates. Replace them with verified prices or remove entries before publishing.
- `faqs`: bilingual answers. Update the fallback questions in `faq.html` if JavaScript is disabled.

Data that is localized uses `{ en: "...", id: "..." }`. Static page copy translations live in `assets/js/main.js`; update both language versions when changing that copy. A fresh browser defaults to English.

## Replace sample artwork

Put the profile image in `assets/images/profile/` and update `ownerImage`. Replace each concept illustration in `assets/images/projects/` with project artwork or update its configured path. Only publish media you own or have permission to use. Add a video file path to that project's `video` field to enable playback in its project dialog.

## Run locally

Open the folder in VS Code and use Live Server, or run this command from the project directory if Python is installed:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500`. No npm packages or build step are needed.

## Static-site limitations

- The contact form does not store or send data to a server. With a valid WhatsApp number configured, it opens a prefilled message for the visitor to review and send. Otherwise, the page explains that WhatsApp is not configured.
- The site has no cart, payment flow, persistent ordering, dashboard, login, or content management.
- The displayed projects and price ranges are examples; replace them before presenting the site as an established portfolio or official price list.
- WhatsApp, email, official business address, operating hours, payment policy, and revision terms have not been provided.
- `referension/` contains reference and learning materials, not site assets. Keep it out of the published site.

