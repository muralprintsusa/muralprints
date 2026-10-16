# Mural Prints

A responsive, static website for a mural and surface printing studio. Open `index.html` in a browser or publish this folder to any static host.

## Enable inquiry submissions

1. Create a Supabase project.
2. In the Supabase SQL Editor, run `supabase.sql`.
3. Copy the Project URL and anon/public key from Project Settings → API into `config.js`.
4. Publish the folder over HTTPS.

## Search engine setup

Before publishing, replace every `https://example.com/` placeholder in `index.html`, `robots.txt` and `sitemap.xml` with the final canonical website URL. The page includes a title and description, social sharing metadata, service structured data and mobile-friendly page markup. After deploying to a public domain, verify ownership in Google Search Console and Bing Webmaster Tools, submit `/sitemap.xml`, and request indexing. Indexing and ranking are controlled by search engines and are not immediate or guaranteed.

The public key is intended for browser use. Never place a Supabase `service_role` key in this site. Row Level Security is enabled, and the SQL grants anonymous visitors insert-only access to validated inquiry fields; there is no public read policy.

The form currently saves name, phone, email and project requirements. It allows visitors to select a JPEG/PNG to indicate a reference image, but file storage is not enabled yet. Uploading files requires configuring a private Supabase Storage bucket and a matching upload policy.

## Content notes

The service cards link to dedicated, crawlable video watch pages in `videos/`. The video pages include visible HTML5 players, stable thumbnail images and `VideoObject` metadata; `sitemap.xml` lists each watch page and video file. After deploying changes, resubmit the sitemap in Google Search Console and use URL Inspection to request indexing for each video page. Google controls whether and when a video is indexed; discovery and structured data do not guarantee video results. Google Fonts, the Supabase client library and photos/videos are loaded from external sources, so internet access is needed for those assets.
