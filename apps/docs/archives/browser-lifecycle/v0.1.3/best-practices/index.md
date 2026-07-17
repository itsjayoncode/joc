# Best Practices

Production guidance for Browser Lifecycle adoption.

## Topics

| Topic                                                                                     | Summary                                          |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------ |
| [Session Lifecycle](/packages/browser-lifecycle/best-practices/session-lifecycle)         | One session per tab, explicit start/stop/dispose |
| [Memory Management](/packages/browser-lifecycle/best-practices/memory-management)         | Unsubscribe and dispose promptly                 |
| [Event Cleanup](/packages/browser-lifecycle/best-practices/event-cleanup)                 | Track unsubscribe handles                        |
| [Performance](/packages/browser-lifecycle/best-practices/performance)                     | Disable unused modules                           |
| [Configuration](/packages/browser-lifecycle/best-practices/configuration)                 | Validate before start                            |
| [Cross-Tab Communication](/packages/browser-lifecycle/best-practices/cross-tab)           | Use leadership instead of ad-hoc `localStorage`  |
| [Idle Detection](/packages/browser-lifecycle/best-practices/idle-detection)               | Choose thresholds deliberately                   |
| [Visibility Handling](/packages/browser-lifecycle/best-practices/visibility-handling)     | Pause expensive work when hidden                 |
| [Framework Integration](/packages/browser-lifecycle/best-practices/framework-integration) | Keep browser access behind providers             |
| [Plugin Development](/packages/browser-lifecycle/best-practices/plugin-development)       | Small hooks, fail safely                         |
| [SSR Safety](/packages/browser-lifecycle/best-practices/ssr-safety)                       | Client-only initialization                       |
| [Security](/packages/browser-lifecycle/best-practices/security)                           | Treat cross-tab messages as untrusted            |
| [Accessibility](/packages/browser-lifecycle/best-practices/accessibility)                 | Do not rely on visibility alone for a11y state   |
| [Testing](/packages/browser-lifecycle/best-practices/testing)                             | Mock capabilities, assert event order            |
| [Debugging](/packages/browser-lifecycle/best-practices/debugging)                         | Use playground and diagnostics APIs              |

## Recommended

- Initialize Browser Lifecycle once per tab
- Dispose on route or component teardown
- Disable modules you do not use
- Validate configuration before creating a session
- Use typed events instead of raw DOM listeners in application code

## Not recommended

- Multiple competing lifecycle instances in one tab
- Passing resolved configuration back into merge helpers
- Subscribing to browser APIs directly when a module already normalizes the signal
- Ignoring plugin errors in production

## Playground

Validate recommendations interactively at [/playground/browser-lifecycle](/playground/browser-lifecycle).
