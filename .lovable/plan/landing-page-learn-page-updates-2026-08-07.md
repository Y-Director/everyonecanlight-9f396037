# Landing page + Learn page updates

## Nav: Learn dropdown
Turn the "Learn" nav item into a dropdown with four entries:
- Articles -> /articles
- Masterclass -> /masterclass
- Courses -> /#notify (waitlist, since courses are still coming soon)
- Diagrams -> /articles

Clicking "Learn" itself still opens the Learn page. On mobile, the four entries appear as indented items under Learn in the existing hamburger menu.

## Learn page
Reorder the top of the page: hero phrase and CTA first as their own text block ("Learn lighting, one lesson at a time." + sub copy + "Explore Free Guides"), then the landing image full width below it (no text overlaid), then the four cards. Everything else on the page stays.

## Landing page (home)
1. Hero headline on mobile breaks into exactly two lines: "Everything a Creator" / "Needs for Lighting". Desktop keeps its current look.
2. "Lighting changes everything" section:
   - Replace the lighting-diagram image with the uploaded video (autoplay, muted, looped, inline, no controls) in the same rounded frame.
   - Replace the second (lower) text card copy with: "Lighting is easier when you understand the setup." as its heading line, followed by the paragraph about exploring real production lighting diagrams, equipment lists, light placement, camera settings and recreating setups.
3. "Built by people who actually light sets": add the three new photos (green vintage room, white-ceiling interview BTS, blue/orange dining set) to the existing image grid, keeping the mosaic balanced across mobile and desktop.
4. Masterclass band: increase section height substantially (taller minimum height on desktop and mobile) so the banner image is no longer visibly cropped.
5. "Practical lighting courses for real productions" section: switch the soft-lime background to the site's dark background, adjust text/input colours to the dark theme, and add a top divider line separating it from the section above.

## Technical notes
- The uploaded MP4 is 4K and 66 MB. It will be transcoded with ffmpeg to a web-friendly muted MP4 (max ~1080px on the long edge, CRF-based, faststart) so it loads quickly, then uploaded as a CDN asset pointer and referenced from `src/pages/Index.tsx`. The original stays out of the repo.
- The three photos are uploaded as CDN asset pointers under `src/assets/trust/` and appended to the `trustImages` array.
- The courses band swaps `--band-soft-lime` usage for the standard background/surface tokens plus a `border-t` divider; no new colours are hardcoded.
- Files touched: `src/components/SiteNav.tsx`, `src/pages/Learn.tsx`, `src/pages/Index.tsx`, plus new asset pointer files.
