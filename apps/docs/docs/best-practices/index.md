# Best Practices

Production guidance for Browser Lifecycle adoption.

## Topics

| Topic                                                          | Summary                                          |
| -------------------------------------------------------------- | ------------------------------------------------ |
| [Session Lifecycle](/best-practices/session-lifecycle)         | One session per tab, explicit start/stop/dispose |
| [Memory Management](/best-practices/memory-management)         | Unsubscribe and dispose promptly                 |
| [Event Cleanup](/best-practices/event-cleanup)                 | Track unsubscribe handles                        |
| [Performance](/best-practices/performance)                     | Disable unused modules                           |
| [Configuration](/best-practices/configuration)                 | Validate before start                            |
| [Cross-Tab Communication](/best-practices/cross-tab)           | Use leadership instead of ad-hoc `localStorage`  |
| [Idle Detection](/best-practices/idle-detection)               | Choose thresholds deliberately                   |
| [Visibility Handling](/best-practices/visibility-handling)     | Pause expensive work when hidden                 |
| [Framework Integration](/best-practices/framework-integration) | Keep browser access behind providers             |
| [Plugin Development](/best-practices/plugin-development)       | Small hooks, fail safely                         |
| [SSR Safety](/best-practices/ssr-safety)                       | Client-only initialization                       |
| [Security](/best-practices/security)                           | Treat cross-tab messages as untrusted            |
| [Accessibility](/best-practices/accessibility)                 | Do not rely on visibility alone for a11y state   |
| [Testing](/best-practices/testing)                             | Mock capabilities, assert event order            |
| [Debugging](/best-practices/debugging)                         | Use playground and diagnostics APIs              |

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

Validate recommendations interactively at [http://127.0.0.1:4273](http://127.0.0.1:4273).
