# KALTRUCK Studio — preview

## In the browser

Open [KALTRUCK Studio on StackBlitz](https://stackblitz.com/github/prophloc/kaltruck-studio?startScript=dev).

1. Allow the project to load from the public GitHub repository.
2. Wait for npm dependency installation and Astro startup.
3. Select the **Preview** panel, or open the generated local preview URL.
4. Check the homepage, gallery at `/realizacje/`, and mobile viewport.

The preview is a development environment, **not** a published company website. It is linked to the current GitHub branch but cannot be assumed to be online until the browser runtime successfully starts.

## On Windows

Clone or download the **current GitHub** repository (rather than the older local ZIP). If Node.js 22 is installed, open the directory and run `START_STRONY_WINDOWS.bat` or:

```powershell
npm install
npm run dev
```

Then open `http://localhost:4321`.

## Publishing

Choose a production domain and hosting provider before enabling indexing. The Astro build currently uses `noindex,nofollow` by default until `PUBLIC_SITE_URL` is configured. Avoid publishing this parallel project with identical SEO copy to KALTRUCK Premium on the same canonical domain.
