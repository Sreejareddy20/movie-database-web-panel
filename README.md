# MovieDB

A responsive movie browser with Popular, Top Rated, Upcoming, search results, and movie detail pages. Movie data and cast credits are fetched through the server-side `/api/movies` route.

## Run locally

1. Get an API key from [The Movie Database](https://www.themoviedb.org/settings/api).
2. Copy `.env.example` to `.env.local` and replace the placeholder with your key. Keep the key server-side; do not add a `NEXT_PUBLIC_` prefix.
3. Install dependencies and start the app:

   ```sh
   pnpm install
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

The `/top-rated` and `/upcoming` routes show their respective collections. Select a movie poster or title to open its detail page.

## Deploy to CodeSandbox

Import or upload this project to CodeSandbox, then add `TMDB_API_KEY` to the sandbox's environment variables before starting the app. The key is required for live movie and cast data.
