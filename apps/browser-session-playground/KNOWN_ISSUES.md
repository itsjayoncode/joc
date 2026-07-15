# Known Issues — Browser Session Playground v1.0.0

## Application

| Issue                                  | Impact                          | Workaround                                                   |
| -------------------------------------- | ------------------------------- | ------------------------------------------------------------ |
| Support route disabled                 | `/support` is not routable      | Use [GitHub Issues](https://github.com/JayOnCode/joc/issues) |
| No automated E2E suite                 | Browser flows require manual QA | Follow [QA_CHECKLIST.md](./QA_CHECKLIST.md)                  |
| Configuration requires session restart | Config changes do not hot-apply | Dispose and recreate session via Configuration page          |

## Browser Lifecycle integration

| Issue                                 | Impact                                                 | Workaround                                                              |
| ------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------- |
| `navigator.onLine` is advisory        | Connectivity state may not match real network failures | Handle request failures in application code                             |
| Cross-tab requires BroadcastChannel   | Cross Tab page shows unavailable fallback              | Test in a modern browser with BroadcastChannel support                  |
| Page lifecycle events vary by browser | Freeze/resume may not fire in all environments         | Consult [browser compatibility matrix](./docs/browser-compatibility.md) |

## Documentation

| Issue                                          | Impact                                       | Workaround                                    |
| ---------------------------------------------- | -------------------------------------------- | --------------------------------------------- |
| Docs site playground URL defaults to localhost | Production docs links need env configuration | Set `VITE_PLAYGROUND_URL` when deploying docs |

## Deployment

| Issue                              | Impact                                    | Workaround                                                 |
| ---------------------------------- | ----------------------------------------- | ---------------------------------------------------------- |
| SPA routing requires host rewrites | Direct URL access may 404 on static hosts | Use provided `_redirects` / `vercel.json` / `netlify.toml` |

## Reporting

File new issues at https://github.com/JayOnCode/joc/issues with the `browser-session-playground` label.
