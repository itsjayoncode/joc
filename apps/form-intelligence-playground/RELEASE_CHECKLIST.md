# Release Checklist — Form Intelligence Playground v1.0.0

## Pre-release

- [x] All Phase 3.1–3.17 dependencies complete
- [x] QA checklist completed
- [x] Performance report documented
- [x] Accessibility checklist documented
- [x] Browser compatibility matrix documented
- [x] Known issues documented
- [x] CHANGELOG updated
- [x] RELEASE_NOTES written
- [x] Version set to `1.0.0`

## Build validation

- [x] Production build succeeds
- [x] Preview server verified
- [x] Asset paths correct
- [x] 404 route handling verified
- [x] Source maps disabled for production (default Vite)

## Deployment

- [x] `netlify.toml` configured
- [x] `vercel.json` configured
- [x] `_redirects` for Cloudflare/GitHub Pages SPA fallback
- [x] Deployment guide written
- [x] Environment variables documented

## CI/CD

- [x] Root `ci:quality` includes playground build
- [x] Playground tests in Vitest workspace
- [x] Deploy workflow added (manual dispatch)

## Post-release

- [ ] Tag `form-intelligence-playground-v1.0.0`
- [ ] Deploy to production static host
- [ ] Update docs site production playground URL
