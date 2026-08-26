# Contributors Portal — Remaining Build

The backend (profiles, posts, notifications, media bucket, view-count function) and the shared top bar are already in place. What's left is the contributor-facing experience and hooking published work into the public site.

## 1. Sign in / Sign up
A single `/contributors/auth` page:
- Email + password sign in and sign up, plus Google sign-in (managed social login enabled the same turn).
- Signed-in visitors are sent straight to the dashboard; signed-out visitors on any contributor route land here.

## 2. Dashboard (`/contributors`)
- Two large 16:9 tiles with plus signs: "New Article" and "New Course".
- Horizontal divider, then a thumbnail grid of everything the contributor has made: cover image, title, status chip (Draft / In review / Published / Needs review) and an eye icon with the view count.
- Cards open the editor; published items also link to the live article.
- Top bar carries the notification bell, avatar upload, and sign out (already built).

## 3. Editor (`/contributors/editor/:id`)
- Cover image upload at the top, title field, and the 19-tag selector (multi-select chips).
- Block-based body: Title, Subtitle and Body text blocks plus Image blocks, matching the article detail page typography.
- Floating control group in the lower third with three actions: add text, move (reorder up/down), add image.
- Autosaves as draft; "Publish for Review" moves the post to in-review and fires the notification.
- Editors' review notes show as an inline banner when a post needs revision.

## 4. Public article integration
Published contributor posts appear on `/articles` alongside the existing curated ones and render at `/articles/:slug` from their blocks, with the author name/avatar in the writer section and a view count increment on load.

## 5. Subdomain
The app serves the same routes on `contributors.everyonecanlight.co`; when the host is that subdomain, `/` renders the contributor dashboard. Connecting the DNS record for the subdomain is done in Project settings > Domains after publishing.

## Technical notes
- New files: `src/pages/contributors/ContributorAuth.tsx`, `ContributorDashboard.tsx`, `ContributorEditor.tsx`, plus small block components under `src/components/contributors/`.
- Routes added to `src/App.tsx` above the catch-all; a guard component uses the existing `useContributorSession` hook.
- Uses existing helpers in `src/lib/contributor.ts` (tags, slugify, media upload) and `src/hooks/useContributor.ts`.
- Article listing/detail read published rows from `contributor_posts` and merge with the static `src/data/articles.ts` entries.
