# Google Maps and Reviews in KALTRUCK Studio

The homepage includes **TRASA** (left) and **OPINIE** (right) slide-out panels, like KALTRUCK Premium. They load their content only when opened.

- TRASA: without an API key, the base location is shown in a Google Maps iframe; entering a route opens native Google Maps directions in a new tab. With a valid Google Maps Embed API key, directions load inside the panel.
- OPINIE: with a valid Maps JavaScript API / Places API key and correct Google Place ID, fetch up to five Google reviews directly. Without the key, show a clear message and a link to Google Maps; never invent ratings or reviews.
- Google may require billing and browser-restricted key setup.

## Local development
Copy the variable names from .env.example to a local .env file, set values, then restart `npm run dev`. **Do not commit actual API keys.**

```
PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_BROWSER_RESTRICTED_KEY
PUBLIC_GOOGLE_PLACE_ID=ChIJhbMF0yh3HEcRVTtOsPxz9eM
```

The Place ID and Tokarska 40 address are based on the existing KALTRUCK Premium configuration; verify they remain accurate before publishing.

The hero photograph, general layout and green Studio color palette remain unchanged.

## Copy local configuration from Premium on Windows

Both sites run the same client-side Google Places review loading code. Premium can
display reviews because its build has `PUBLIC_GOOGLE_MAPS_API_KEY`; Studio needs
its **own local environment configuration** before the reviews can load.

In KALTRUCK Studio run `KONFIGURUJ_GOOGLE_Z_PREMIUM.ps1`. Select the **.env**
file from your Premium checkout. The script copies **only** the two PUBLIC Google
configuration values into Studio's own git-ignored `.env` file. If Premium has
no local `.env` because keys were configured in hosting instead, configure the
values manually from your own Google Cloud console.

Restart the Studio dev server after that: `Ctrl+C`, then `npm run dev`.
Ensure your Google key is restricted to approved **HTTP referrers**, including
`http://localhost:4321/*` for local development and the actual production domain.
The key's project needs Maps JavaScript API, Places API (New), and for embedded
directions Maps Embed API, plus any required billing.

Do not publish a Google API key in the repository. A PUBLIC key is intentionally
sent to the browser at runtime: its security comes from HTTP referrer and API
restrictions, not keeping the frontend JavaScript secret. Google reviews shown
in the panel are returned by Google (typically up to five) and are never faked.
