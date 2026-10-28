# Marci Metzger Homepage Revamp

This folder contains a responsive homepage redesign for Marci Metzger / The Ridge Realty Group. It includes a Vercel serverless AI receptionist and improves the existing Pahrump Realtor site while retaining its identity, core sections, source-site imagery, and real contact paths.

## Preview

To preview the static design only, open `index.html` in a browser. To use the receptionist locally, run it through Vercel so `/api/receptionist` is available:

```powershell
vercel dev
```

Then visit the local URL printed by Vercel. A plain static file server will not run the AI API.

## Project files

- `index.html` — homepage content and structure
- `styles.css` — desktop, tablet, and mobile styling
- `script.js` — mobile navigation, gallery controls, Zillow search handoff, and the on-page AI receptionist client
- `api/receptionist.js` — Vercel server function; calls the Gemini API without exposing the secret to the browser
- `.env.example` — names the server-side environment variables needed for local development
- `images/` — affiliation marks, reviewer portraits, and The Ridge Realty Group round mark

## Source and behavior

The original downloaded site is in `C:\Users\NotSet2\Downloads\marcimetzger.com\marcimetzger.com\`. It is a generated GoDaddy Website Builder snapshot, so images and hosted behaviors are not all available as local source files.

This revamp uses the original homepage’s Mountain Falls hero image, Marci’s existing portrait, and seven actual photo-gallery images from the live Marci Metzger site. The gallery presents the selected photo beside a navy caption panel, with seven selectable thumbnails below, styled to fit the site’s own palette and typography. It advances automatically with a restrained crossfade, pauses while visitors hover or use its controls, and disables automatic motion when reduced motion is requested. Minimal left and right controls allow manual browsing. The service cards pair two real Pahrump listing photos with Marci’s portrait: homes illustrate the buying and property-selection services, while Marci’s photo represents her professional guidance. All three use matching square crops and a consistent frame. The experience section highlights Marci’s REALTOR service since 1995 and presents the supplied 2021 client and sales figures as separate, readable facts. The Pahrump brokerage mark is a local copy from the supplied Ridge Realty Group site files. The site images from the GoDaddy and Zillow CDNs require an internet connection; the brokerage mark is a local file. The existing listing, about, and contact flows remain linked to the live site:

The “Homes around here” section adds property photos for all five Zillow addresses supplied by the user. Each card links to its corresponding Zillow property page. The 3121 Deacon Ct photo is served from Realtor.com’s image CDN; the other four photo URLs use Zillow’s image CDN. This section uses neutral property labels rather than claiming that every address is a completed sale by Marci.

- Listings: https://marcimetzger.com/listings
- About Marci: https://marcimetzger.com/about-us
- Contact form: https://marcimetzger.com/lets-move

The dream-home form passes location, home type, price range, bedroom/bath minimums, and sort preference to a Zillow search in a new tab. Zillow’s results cover the selected area; the separate Marci profile link goes to her active agent listings. The form requires an internet connection and uses Zillow’s public search URL rather than a private MLS API.

The “Call or Visit” section uses the Pahrump office phone, hours, address, broker number, and social links from the supplied source-site files. The custom on-page receptionist calls the server-side Gemini API. Its instructions limit it to verified brokerage facts, prohibit invented listing details and professional legal/financial advice, and direct people to Marci for decisions or current MLS availability. The browser discloses AI processing and advises visitors not to share sensitive financial information. The site itself does not save a transcript; submitted messages are processed by Google's Gemini API under its data policies. The chat requires a Vercel deployment and a server-side `GEMINI_API_KEY`.

The contact section now includes an embedded Google map for the Ridge Realty Pahrump office. The affiliations area uses the Ridge Realty, Equal Housing Opportunity, REALTOR®, and Pahrump Valley Chamber logos from the reference image supplied by the user; the brokerage, REALTOR®, and Chamber marks link to their public profiles. Equal Housing Opportunity is presented as a fair-housing commitment, not as a claimed membership. The client-feedback section transcribes nine five-star review excerpts from Yelp and Google screenshots supplied by the user. Each card labels and links to its source platform, with the date shown separately for stable wrapping. The first three Yelp reviewer photos are shown in the initially visible cards; James D. has a profile photo in the expanded reviews; the remaining reviews expand with the “See More Testimonials” control. Other reviewers use initials avatars. Supplied names, dates, locations, and review text are reproduced where visible. One additional Yelp review screenshot (Cheryl T.) is also supplied but omitted from the featured cards to keep the section concise. Cropped reviewer avatar image assets are in `images/reviewer-*-yelp.jpg`; affiliation logo crops are in `images/affiliation-*.png`.

The social-link band uses the site's navy palette, compact labeled links, and platform icons. Its Yelp favicon is loaded from Yelp's official CDN; Yelp's [brand guidance](https://www.yelp.com/brand) identifies the favicon as a suitable shortcut to a Yelp page in website footers.

## Vercel setup

1. Import this folder as a Vercel project and deploy it as a static site with the root directory set to this folder. Vercel detects the `/api` function automatically.
2. In Vercel Project Settings → Environment Variables, add `GEMINI_API_KEY`. Optionally set `GEMINI_MODEL`; the default is `gemini-3.8-flash`.
3. Redeploy after adding or changing environment variables. Keep the key server-side; never add it to `index.html`, `script.js`, or a `NEXT_PUBLIC_` variable.
4. For local AI testing, use `vercel dev` with a local `.env.local` file. Do not commit that file.

The API applies request-size limits, same-origin checks, short message/history caps, and a best-effort per-instance rate limit. Serverless instances do not share that in-memory counter; add a Vercel Firewall rate rule or shared rate-limit store before relying on it for high-traffic public use.

Visitor follow-up email sending is not enabled yet. The existing call/email links work; a form that transmits a visitor’s name, email, and message to an inbox needs a confirmed recipient and explicit visitor consent.

## Content notes

The home page keeps Marci’s Pahrump focus, experience since 1995, buyer and seller guidance, gallery, services, and office/contact information. The brokerage office number and weekday hours are from the supplied Pahrump Ridge Realty Group site files. Sales numbers are labeled as a 2021 snapshot so they are not presented as current. The biographical summary is based on the live About page. Public profiles used to substantiate credentials and review status include [Realtor.com](https://www.realtor.com/realestateagents/56d6a197b5cc660100bd8a0e), [Zillow](https://www.zillow.com/profile/marcimetzger), and the [Pahrump Valley Chamber directory](https://business.pahrumpchamber.com/list/member/marci-metzger-homes-pahrump-valley-properties-818). The single review record is linked to its [Driggs Title Agency source page](https://www.driggstitle.com/reviews/Marci_Metzger/4775_E_Lorenzo_Pahrump_89061_5.html).

## Design choices

The two supplied Ridge Realty Group site archives informed the brokerage styling: deep navy and white, Lato body text, Lusitana display text, clear license credentials, and a direct link to the Pahrump team site. The page alternates warm ivory, white, cool blue-gray, and deep slate surfaces to create clearer visual rhythm between sections. The second archive belongs to an Orange County business, so its service-navigation and social-proof patterns are references only; its contact details, team, listings, and photos are not used. The earlier visual references informed the full-bleed hero, editorial scale, image hierarchy, and service-card arrangement. Marci’s content, local identity, and gallery remain the subject of the redesign.

## Before publishing

Confirm that image assets load from the GoDaddy CDN in the target host, review all copy and contact details, and configure the Gemini API key in Vercel. The listing form opens Zillow area results; use the official MLS integration if searches must remain inside the website. Confirm the follow-up email recipient before enabling visitor inquiry emails.

