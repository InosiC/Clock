# Clock

Seeded by Sentino greenhouse. The build plan grows this repo step by step.

A Mickey Mouse–themed clock with a Lord of the Rings backdrop, built with
Vite + React + TypeScript. The app is shipped as a static build and served
behind IIS (staging) — no database or server runtime is required.

## Development

```bash
npm install
npm run dev      # start the Vite dev server
npm test         # run the Vitest + React Testing Library suite
npm run build    # type-check and produce the static build in dist/
```

## Static build

`npm run build` runs `tsc -b` and `vite build`, emitting the static site to
`dist/`. Everything in `public/` (including `web.config`) is copied verbatim
into `dist/`.

### Base path for IIS virtual paths

By default the app is built for a root-site deployment (`base = "/"`). If the
staging site lives under an IIS **virtual path** (for example
`https://staging.example/clock/`), build with the matching base so asset URLs
resolve correctly:

```bash
# Windows (cmd):   set VITE_BASE=/clock/ && npm run build
# PowerShell:      $env:VITE_BASE="/clock/"; npm run build
# bash:            VITE_BASE=/clock/ npm run build
```

## Deploying to the IIS staging site

1. Build the static bundle:

   ```bash
   npm run build           # or VITE_BASE=/<virtual-path>/ npm run build
   ```

2. Copy the **contents** of `dist/` into the IIS staging site's physical
   folder (e.g. `C:\inetpub\wwwroot\clock`), replacing the previous release.

3. The bundled `web.config` configures IIS to:
   - serve audio assets (`.mp3`, `.ogg`, `.wav`) with the correct MIME types, and
   - rewrite unmatched routes to `index.html` so client-side routing and
     deep-link refreshes fall back to the SPA.

   IIS needs the **URL Rewrite** module installed for the SPA fallback rule.

No application pool runtime is required — IIS only serves static files.
