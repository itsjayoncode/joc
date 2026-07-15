---
title: Deployment
description: Interactive playground documentation for Deployment.
---

# Deployment Guide

Deploy the Browser Session Playground as a static SPA.

## Build

```bash
pnpm browser-session-playground:build
```

Output: `apps/browser-session-playground/dist/`

## Preview locally

```bash
pnpm browser-session-playground:preview
```

Open http://127.0.0.1:4274

## Environment variables

| Variable                             | Description                              | Default                   |
| ------------------------------------ | ---------------------------------------- | ------------------------- |
| `VITE_PLAYGROUND_BASE`               | Asset base path for subdirectory hosting | `/`                       |
| `VITE_PLAYGROUND_SUPPORT_URL`        | Support link in metadata                 | GitHub Issues             |
| `VITE_PLAYGROUND_SUPPORT_LABEL`      | Support link label                       | Report an issue on GitHub |
| `VITE_PLAYGROUND_ENABLE_DEBUG_TOOLS` | Enable extra debug tooling               | `false`                   |

Copy `.env.example` to `.env.local` for local overrides.

## Static hosting

### Netlify

Repository includes `apps/browser-session-playground/netlify.toml`.

```bash
netlify deploy --prod --dir=apps/browser-session-playground/dist
```

### Vercel

Repository includes `apps/browser-session-playground/vercel.json`.

Set root directory to `apps/browser-session-playground` and build command to `pnpm build`.

### Cloudflare Pages

Use build command `pnpm browser-session-playground:build` and output `apps/browser-session-playground/dist`. SPA fallback is in `public/_redirects`.

### GitHub Pages

Set `VITE_PLAYGROUND_BASE=/joc/` (or your repo name) before build:

```bash
VITE_PLAYGROUND_BASE=/joc/ pnpm browser-session-playground:build
```

Deploy `dist/` to GitHub Pages.

## SPA routing

All hosts must rewrite unknown paths to `index.html`. Config files are provided for Netlify, Vercel, and Cloudflare.

## Rollback

Redeploy the previous `dist/` artifact or revert to the prior git tag (`browser-session-playground-v1.0.0`).

## CI deployment

GitHub Actions workflow `.github/workflows/deploy-playground.yml` supports manual production deploy after build validation.
