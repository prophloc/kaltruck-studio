# KALTRUCK Studio — SEO / launch checklist

This is the **Studio** site. It is separate from KALTRUCK Premium and must use an independent production HTTPS domain and genuinely useful, non-duplicated content.

## What is implemented

- Independent title and meta description for the homepage, company, equipment, gallery, contact and six service pages.
- Each service includes its own explanatory guide, preparation steps, visible questions, related services and contact link.
- Dynamic absolute canonical and Open Graph URL derived from `PUBLIC_SITE_URL`, no hard-coded Premium canonical.
- Open Graph and X/Twitter preview image; correct image MIME type for PNG/JPG/WEBP.
- `LocalBusiness` with confirmed Płock address and two telephone numbers, `WebSite`, `WebPage`, `BreadcrumbList`, `Service`, and FAQ data only where answers are visible.
- `/sitemap.xml`, `/robots.txt`, and indexing disabled when final production URL is not configured.
- Social links and original KALTRUCK imagery. No made-up reviews, star ratings, awards, opening hours or prices in structured data.

## Production launch

1. Set `PUBLIC_SITE_URL=https://your-final-studio-domain.example` for **the production build**. It must be the preferred HTTPS host without a path. Do not point it to `hdsplock.pl` or the Premium host unless that is truly where Studio is being published.
2. Run `npm install`, `npm test`, `npm run build`, `npm run test:seo:build`. The CI pipeline builds with an invalid **test-only** origin to verify metadata; that test origin is never intended for publishing.
3. Inspect `/robots.txt`, `/sitemap.xml`, `/uslugi/transport-hds/`, and other service URLs on the deployed domain. All canonicals and schema IDs must match the final HTTPS host. Nothing should contain `localhost` or `example.invalid`.
4. Verify address, phone numbers, equipment specifications and all photography rights with the company. Check that images loaded from `hdsplock.pl` and the social image load over HTTPS with HTTP 200.
5. Submit `/sitemap.xml` to Google Search Console for Studio's own domain. Inspect the six service pages individually. Configure Analytics only if consent and privacy requirements are met.
6. Check structured data in the Schema.org validator and Google's Rich Results Test; structured data eligibility does not guarantee rich results, especially FAQ results.
7. Run PageSpeed Insights on live mobile/desktop. The external HDS images, map iframe and Google reviews affect performance. Measure actual Core Web Vitals rather than assuming scores.
8. Observe index coverage and page/query performance over several weeks. Both Premium and Studio target related transport searches, so compare cannibalization risk and improve their distinct purpose rather than generating duplicate location pages.

## Preview safety

Without `PUBLIC_SITE_URL`, local development remains `noindex,nofollow` and `robots.txt` disallows crawlers. **Do not publish that build as production**. The CI integration check verifies a sample configured domain but is not a live traffic or ranking audit.

We intentionally do not add fictional geographic landing pages, fake review markup or unverified claims about truck equipment or pricing.
