# Barangay Portal

A resident portal prototype for a Philippine barangay, presented as a **hall-notice board**: walnut dark chrome, cream paper cards, and rubber-stamp status pills.

Residents sign in, request certificates, track request status, see how the barangay budget was spent, and reach the developer's team through a contact form.

> **This is a front-end prototype.** There is no backend - every sign-in succeeds, and no data is sent anywhere or persisted. See [Status](#status) for what that means.

## Features

- **Sign-in screen** - split hero with a rotating photo slideshow (5s crossfade) and a centered sign-in card.
- **Home** - active requests with status pills, barangay announcements, and the FY 2026 total budget.
- **Certificates** - request a Barangay Clearance (₱50), Certificate of Residency (₱30), or Certificate of Indigency (free). Includes a live certificate preview that fills in the applicant's name and purpose, formatted like an official document with a seal and QR block.
- **Budget** - allocation breakdown, spent-vs-allocated bars per category, and project completion progress.
- **About us** - services offered, process, developer profile with photo and resume link, and a validated contact form.

### Form validation

Both forms validate on submit and mark invalid fields with `aria-invalid`, moving focus to the first bad input. The certificate form also blocks duplicate pending requests of the same type. Errors and confirmations are announced via `role="alert"` and `role="status"` live regions.

## Tech stack

No framework, no build step, no dependencies.

| Layer | Choice |
| --- | --- |
| Markup | HTML5 |
| Styling | CSS3, custom properties for theming |
| Script | Vanilla JavaScript (ES5-style) |
| Fonts | Barlow + Barlow Condensed (Google Fonts) |
| Photos | Pexels CDN (login slideshow) |

## Getting started

Clone and open the file - that's it, there is nothing to install or compile:

```bash
git clone https://github.com/Chie03-dev/Barangay.git
cd Barangay
```

Open `index.html` in any modern browser. To serve it over HTTP instead:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

> Serving over HTTP is recommended rather than opening the file directly, so that font and image loading behaves exactly as it will in production.

## Project structure

```
Barangay/
├── index.html      # Single page: #login view + #app with four tab sections
├── styles.css      # All styling; base theme then a hall-notice override block
├── app.js          # Mock data, view rendering, form handlers, slideshow
├── .clinerules     # Conventions for Cline AI assistance
├── .gitignore
└── assets/
    ├── niga.png    # Developer portrait
    └── niga.pdf    # Resume
```

### How it works

- Two top-level views, `#login` and `#app`, toggled with the `hidden` attribute.
- `#app` holds four sections (`home`, `cert`, `budget`, `about`). A single `tab(t)` function acts as the router: it updates `aria-selected` on the tab buttons and toggles section visibility.
- Mock data lives in arrays at the top of `app.js` - `types`, `reqs`, `budget`, `projs`. Totals are always derived from these arrays, never hardcoded.
- Views render by assigning template-literal HTML to `innerHTML`, with one render function per view. User-supplied values in the certificate preview are written via `textContent`, not interpolated into markup.
- Cross-view navigation uses `data-go="<tab>"` attributes, wired up in one pass.

## Accessibility and responsiveness

- Mobile-first, tested from ~320px up; containers cap at 960px.
- Tabs use `role="tablist"`/`role="tab"` with `aria-selected`.
- Visible `:focus-visible` outlines throughout.
- Respects `prefers-reduced-motion` for both bar transitions and the slideshow.
- Safe-area insets (`env(safe-area-inset-*)`) handled for notched devices.
- All form fields have associated `<label for>` elements.

## Placeholders to replace

Bracketed text is intentional scaffolding awaiting real details:

- `[Pangalan]`, `[City / Municipality]`, `[Province]`, `[Punong Barangay Name]`
- `[Company name]`, `[email address]`, `[mobile number]`, `[office address]`, `[Hours]`
- The developer's title and bio line in the "Meet the developer" card
- `assets/niga.png` and `assets/niga.pdf` - swap in your own portrait (portrait orientation, ~800×1000px) and resume; update the `src`/`href` in `index.html` if you rename them

## Status

Working: all navigation, form validation, certificate preview, budget charts, slideshow, and sign-out.

Not implemented - the prototype stops here by design:

- No backend, database, or API. Sign-in accepts any input and always succeeds.
- No persistence. Requests and contact messages are lost on reload.
- QR code on the certificate preview is a decorative CSS pattern, not a scannable code.
- Certificate preview is for demonstration only and produces no real document.

## Contributing

Branch off `main`, keep commits small and descriptive, and follow the conventions in `.clinerules`. Before opening a pull request, check the page in a browser and confirm there are no console errors.

## License

[Add a license - MIT, Apache-2.0, or as required by the project owner.]