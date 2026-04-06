# ADR-001: CSP via build-time hash extraction

## Status
Accepted

## Problem
Astro generates inline `<script>` and `<style>` tags for its island hydration
system. These cannot be externalised — they are fundamental to how Astro
renders interactive components in static HTML.

A strict Content Security Policy (`script-src 'self'; style-src 'self'`) blocks
these inline resources, breaking the entire site (blank page, no interactivity,
no fonts).

Additionally, the `@fontsource/jetbrains-mono` package was being inlined by
Vite as base64 `data:` URIs, violating `font-src 'self'`.

## Decision
1. **Hash-based CSP via `<meta>` tag** — A post-build script
   (`scripts/generate-csp.mjs`) extracts SHA-256 hashes of all inline scripts
   and styles from built HTML, then injects a
   `<meta http-equiv="Content-Security-Policy">` tag with those hashes.

2. **External font files** — Vite's `assetsInlineLimit` set to `0` to emit
   font files as separate `.woff2` assets instead of data: URIs.

3. **CSP removed from CloudFront** — The CSP was previously set as a CloudFront
   response header. Since hashes change every build, a static header would
   require cross-repo Terraform apply on every deploy. The meta tag approach
   keeps CSP self-contained in the app repo.

## Why not `unsafe-inline`?
`unsafe-inline` defeats the purpose of CSP — it allows any injected script to
execute, providing no XSS protection. Hash-based CSP only allows the specific
scripts generated at build time.

## Why meta tag over HTTP header?
- Hashes change with every Astro build (version updates, code changes)
- HTTP header lives in CloudFront (infra repo), requiring Terraform apply per deploy
- Meta tag is generated alongside the HTML, keeping the lifecycle self-contained
- For a single-page static site, meta tag CSP limitations (`frame-ancestors`,
  `report-to`) are irrelevant — `X-Frame-Options: DENY` is set via CloudFront

## Advice: planned simplification
We have decided to migrate away from Astro to a plain Vite + React SPA. Astro's
island architecture is the root cause of the inline script injection that
necessitates this hash extraction complexity.

After migration:
- React hydrates via an external bundle — no inline scripts
- Tailwind CSS compiles to external stylesheets — no inline styles
- CSP can return to a simple static `script-src 'self'; style-src 'self'`
  CloudFront header with no build-time hash extraction
- The `scripts/generate-csp.mjs` post-build step can be removed entirely
