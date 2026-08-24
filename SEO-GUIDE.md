# Abbey Cars SEO Guide

This project uses Next.js App Router for SEO and keeps the existing React interface and PHP/MySQL API.

## 1. Start Next.js

Run the Next.js development server:

```bash
npm run dev:next
```

Open:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build:next
npm run start:next
```

## 2. Add Page Titles and Descriptions

Edit:

```text
app/[[...slug]]/page.jsx
```

Add or update an entry in `pageMetadata`. The key must match the URL path.

```jsx
const pageMetadata = {
  services: {
    title: 'Taxi Services in Reading',
    description: 'Reliable local taxis, airport transfers and corporate travel in Reading and Berkshire.',
  },
  booking: {
    title: 'Book a Taxi in Reading',
    description: 'Request a reliable taxi journey with Abbey Cars in Reading and Berkshire.',
  },
}
```

The title should usually be 50-60 characters. Keep the description useful and around 150-160 characters. Each important page should have unique text.

For a URL such as `/taxi-reading`, add:

```jsx
'taxi-reading': {
  title: 'Taxi in Reading | Abbey Cars',
  description: 'Book a trusted local taxi in Reading for everyday journeys, airport transfers and long-distance travel.',
},
```

For a nested URL such as `/services/heathrow-airport-transfers`, use the complete path as the key:

```jsx
'services/heathrow-airport-transfers': {
  title: 'Heathrow Airport Transfers from Reading',
  description: 'Book a dependable Heathrow airport transfer from Reading with professional local drivers.',
},
```

The page automatically generates:

- `<title>`
- Meta description
- Canonical URL
- Open Graph title and description
- Twitter/X title and description

## 3. Add the Page Content

The visible page content is still rendered by the existing React page components in:

```text
src/legacy-pages/
```

Important SEO rules:

- Use one main `<h1>` per page.
- Use `<h2>` for main sections.
- Use `<h3>` inside those sections.
- Put the primary service or location in the H1.
- Write useful, human-readable content. Do not repeat keywords unnaturally.
- Add descriptive `alt` text to meaningful images.
- Use normal links for related pages, such as `/booking`, `/contact`, and service pages.

## 4. Add URLs to the Sitemap

Edit:

```text
app/sitemap.js
```

Add every important public URL to `publicRoutes`:

```jsx
const publicRoutes = [
  '',
  'services',
  'booking',
  'contact',
  'taxi-reading',
  'taxi-wokingham',
  'taxi-bracknell',
]
```

The sitemap is available at:

```text
http://localhost:3000/sitemap.xml
```

Do not add admin, login, API, or private URLs.

## 5. Configure Robots

Edit:

```text
app/robots.js
```

The current rules allow public pages and block:

- `/admin`
- `/api`
- `/login`
- `/private`

The sitemap URL is included automatically. When deploying, set `NEXT_PUBLIC_SITE_URL` to the real HTTPS domain so canonical URLs and sitemap URLs use the production domain.

Example PowerShell command:

```powershell
$env:NEXT_PUBLIC_SITE_URL = 'https://www.example.com'
```

## 6. Structured Data

The main LocalBusiness schema is in:

```text
app/layout.jsx
```

Only add facts that are real and visible on the website. Suitable schema types include:

- `LocalBusiness` for Abbey Cars
- `Service` for a specific taxi service
- `BreadcrumbList` for nested pages
- `FAQPage` only when the page visibly contains the matching questions and answers

Do not add fake reviews, ratings, prices, addresses, or opening hours.

## 7. Images

Images imported from `src/assets` must work in both Vite and Next.js. Existing legacy `<img>` elements use this compatible pattern:

```jsx
src={typeof image === 'string' ? image : image.src}
```

Use descriptive alt text:

```jsx
<img src={imageUrl} alt="Abbey Cars vehicle ready for an airport transfer" />
```

Use `object-contain` when the entire image must be visible. Use `object-cover` only when cropping is intentional.

## 8. PHP API and Security

The PHP backend remains in:

```text
api/
```

Next.js proxies API requests through `next.config.mjs`. Do not put MySQL credentials in React components, Next client code, or public environment variables.

Keep these files private:

```text
api/google-sheets-config.php
cookiejar.txt
cookies.txt
```

## 9. SEO Verification Checklist

After changing SEO data:

1. Run `npm run build:next`.
2. Run `npm run start:next`.
3. Open the page directly, for example `/services` or `/taxi-reading`.
4. Check the browser tab title.
5. View page source and confirm the title and description are present.
6. Check the canonical URL.
7. Check `/sitemap.xml`.
8. Check `/robots.txt`.
9. Confirm the page has one correct H1.
10. Confirm images load and have useful alt text.

Useful production URLs:

```text
/
/services
/fleet
/booking
/contact
/robots.txt
/sitemap.xml
```

## 10. Production Deployment

Set these environment variables on the hosting server:

```text
NEXT_PUBLIC_SITE_URL=https://your-real-domain.com
PHP_API_ORIGIN=https://your-real-domain.com
```

Then run:

```bash
npm install
npm run build:next
npm run start:next
```

Make sure the PHP API and MySQL database are available at the configured PHP API origin. Submit the production sitemap to Google Search Console after deployment.
