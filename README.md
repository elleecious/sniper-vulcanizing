# Sniper Tubeless Vulcanizing Shop — one-page site

Static site: HTML, Tailwind (CDN), custom CSS, vanilla JS + jQuery. No backend.

## Run locally
Open `index.html`, or serve the folder: `python3 -m http.server 8000`.

## Replace before launch
1. **Logo** — save your logo as `assets/images/sniper-logo.png` (keep its proportions). If missing, the nav shows a text name.
2. **Photos** — add `assets/images/hero-tire-service.jpg` and `about-tire-service.jpg` (optimize to under ~300 KB). To use a hero photo, in `assets/css/style.css` change `.hero` background to `linear-gradient(rgba(17,17,17,.75),rgba(17,17,17,.85)),url(../images/hero-tire-service.jpg) center/cover`, and remove the two decorative `<svg>` tires in `index.html` if you like.
3. **Contact details** — edit the `CONFIG` object at the top of `assets/js/script.js`:
   - `phone` → enables CALL NOW, the mobile floating button, and shows the number
   - `whatsapp` → digits with country code (e.g. `639171234567`); enables the inquiry form
   - `facebookUrl` / `messengerUrl` → MESSAGE US and footer link
   - `address` → shown in the contact panel
   - `mapsUrl` → Google Maps share link; enables GET DIRECTIONS
   Anything left empty is hidden, so there are no broken links.

## Deploy
Upload the whole folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, cPanel). Optional: compile Tailwind for production instead of using the CDN.
