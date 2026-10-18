# KALTRUCK Studio

**Independent Astro website for Transport HDS Kalwasińscy.** A second, modern visual direction developed independently from [KALTRUCK Premium](https://github.com/prophloc/kaltruck-premium).

## Features

- Responsive editorial homepage with transport photography and dedicated call-to-action.
- Six SEO service pages for HDS transport, containers, machines, precast concrete, unloading, and crane rental.
- Project gallery with categories, fullscreen dialog, keyboard navigation and accessible controls.
- About and contact pages, with a lightweight e-mail quote workflow.
- Per-page meta descriptions, LocalBusiness JSON-LD, canonical URLs, robots.txt and sitemap.
- GitHub Actions checks on every push and pull request.

## Local development

Install [Node.js 22 LTS](https://nodejs.org/) and run:

```bash
npm install
npm run dev
```

Open <http://localhost:4321>.

For Windows users, `START_STRONY_WINDOWS.bat` installs dependencies and starts the development server.

## Tests and builds

```bash
npm test
npm run build
npm run preview
```

GitHub Actions runs the tests and build after code is pushed. A passing build is required before production deployment.

## SEO and publishing

The prototype is deliberately marked **noindex** until you configure the correct production domain. Before deploying, set `PUBLIC_SITE_URL=https://your-real-domain.example` in the build environment. Replace the example with the actual authorized domain. The setting enables canonical URLs, sitemap and indexing directives.

Avoid publishing this website and KALTRUCK Premium with duplicate SEO content on the same domain. The two projects are separate implementations; choose an appropriate production strategy.

## Content and images

The content is based on KALTRUCK's current HDS transport service information. The prototype references existing KALTRUCK photos hosted at hdsplock.pl and the KALTRUCK Premium repository. Before public release, verify all image URLs, usage rights, performance and mobile crops.

The contact form opens a **draft e-mail** in the user's configured email app. It does not send or store inquiries on a server. Replace it with a real form backend if needed.

## Repository and history

Source of truth: [prophloc/kaltruck-studio](https://github.com/prophloc/kaltruck-studio). This project was initialized in GitHub and improved through separate feature commits. It does **not** modify KALTRUCK Premium.

Important: the earlier downloadable ZIP is an independent local prototype with a separate Git history. **Do not run its original GitHub push script against this repository**, since the online branch already contains commits. For local work, clone the online repository instead:

```bash
git clone https://github.com/prophloc/kaltruck-studio.git
cd kaltruck-studio
npm install
npm run dev
```
