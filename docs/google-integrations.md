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
