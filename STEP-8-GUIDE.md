# SkillVault — STEP 8: Free Hosting + Google Indexing

## Recommended ₹0 option: Cloudflare Pages

Cloudflare Pages can deploy a static site through Git integration or Direct Upload.

### Direct Upload
1. Create/log in to Cloudflare.
2. Open **Workers & Pages**.
3. Create a Pages project and choose **Direct Upload**.
4. Upload the contents of this SkillVault folder.
5. Cloudflare gives you a free `*.pages.dev` address.

### Git-based deployment
1. Put this SkillVault folder in a GitHub repository.
2. In Cloudflare Pages choose Git integration.
3. Connect the repository.
4. This is a plain static site, so no framework build is required.
5. Deploy the repository root as the site.

## Alternative ₹0 option: GitHub Pages

A GitHub Pages workflow is included at:
`.github/workflows/deploy-pages.yml`

1. Create a GitHub repository.
2. Upload all SkillVault files to the repository root.
3. Use the `main` branch.
4. Go to **Settings → Pages**.
5. Set the Pages source to **GitHub Actions**.
6. Push to `main`; the included workflow deploys the site.
7. GitHub will provide a `github.io` URL.

## IMPORTANT: Update the live URL

After deployment, replace:

`https://YOUR-SITE.pages.dev`

inside:
- `sitemap.xml`
- `robots.txt`

Also update canonical/SEO URLs if you later hard-code a final domain.

## Google Search Console

After the site is publicly accessible:
1. Add the live site in Google Search Console.
2. Verify ownership.
3. Open **Sitemaps**.
4. Submit `sitemap.xml`.
5. For important pages, use **URL Inspection** and request indexing.

Submitting a sitemap helps Google discover multiple new/updated URLs, but it does not guarantee ranking or indexing.

## Custom domain

### Cloudflare Pages
If you already own a domain:
Workers & Pages → your project → Custom domains → Set up a domain.

### GitHub Pages
A custom domain can be configured in the repository's Pages settings. GitHub Pages supports HTTPS for correctly configured custom domains.

A domain registration itself is normally not free. You can launch first using `pages.dev` or `github.io` for ₹0.

## Included deployment files

- `.nojekyll`
- `.github/workflows/deploy-pages.yml`
- `_headers`
- `404.html`
- `manifest.webmanifest`
- `robots.txt`
- `sitemap.xml`
- `GOOGLE-SEARCH-CONSOLE.txt`
- `SITE-URL.txt`

## Important limitation

The current admin page from Step 7 is only a static/local admin UI concept. A static host cannot securely save edits back to `courses.json` from a browser without a backend/database or repository API. Do not treat a client-side password as real admin security. A genuinely secure web admin panel requires backend authentication/storage; that can be added later if needed.
