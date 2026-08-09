# SkillVault — FINAL LAUNCH CHECKLIST

## A. Must change before going live
- [ ] `data/settings.json` → replace `YOUR_TELEGRAM_USERNAME`
- [ ] Replace all demo course titles, creators, prices, descriptions and images
- [ ] Use only courses you are authorized to sell/distribute
- [ ] Replace refund/replacement wording in `policies.html` with your real policy
- [ ] Replace `https://YOUR-SITE.pages.dev` in `robots.txt` and `sitemap.xml`
- [ ] Confirm all creator names and course attributions are accurate
- [ ] Remove any demo ratings/review counts unless they are real

## B. Recommended before launch
- [ ] Upload your own course images to `assets/`
- [ ] Check homepage on Android phone
- [ ] Check homepage on desktop Chrome
- [ ] Open at least 5 course detail pages
- [ ] Test every Telegram button
- [ ] Test search and filters
- [ ] Test 404 page
- [ ] Check About / Contact / Policies / Disclaimer pages

## C. Hosting
Recommended free options:
- Cloudflare Pages
- GitHub Pages

## D. Google
After the public URL works:
- [ ] Add site to Google Search Console
- [ ] Verify ownership
- [ ] Submit `sitemap.xml`
- [ ] Inspect homepage and important course pages

## E. Security / trust
- Static hosting is safe for public content, but:
  - Do not put private passwords/API keys in JS/HTML/JSON
  - Do not expose payment secrets
  - Do not claim a browser-only admin page is secure
  - A real online admin panel needs backend authentication/storage
- Use the official Telegram username only
- Keep policy wording consistent with actual practice

## F. Admin note
Step 7 was a static admin concept/template. It is not included as a secure production admin backend.
For now, manage courses by editing:
- `data/courses.json`
- `data/settings.json`

## G. Production recommendation
Launch with the editable JSON system first.
Add a real authenticated admin panel later only when needed.
