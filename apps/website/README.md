# JayOnCode website

Public landing for the **JOC Ecosystem** — routes people to docs, playgrounds, and packages. Not a framework shell.

## Local

```bash
pnpm --filter @jayoncode/website dev
pnpm --filter @jayoncode/website build
```

- Dev: http://127.0.0.1:4180
- Preview: http://127.0.0.1:4181

## Links

| Surface     | URL                                                   |
| ----------- | ----------------------------------------------------- |
| Docs        | https://itsjayoncode.github.io/joc/                   |
| Playgrounds | https://itsjayoncode.github.io/joc/playground/        |
| Composition | https://itsjayoncode.github.io/joc/guides/composition |
| GitHub      | https://github.com/itsjayoncode/joc                   |

Production host for `jayoncode.com` can point at this app’s build output when DNS/hosting is ready. Until then, the VitePress docs home remains an equivalent landing.
