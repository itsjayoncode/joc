# Ecosystem ADRs

Architecture Decision Records for the JOC **ecosystem** (package independence, shared infra, expansion).

Product ADRs (CAPTCHA, UI projection, etc.) stay under package construction folders or package `engineering/`.  
Repo-wide coding standards stay under root `engineering/*.md`.

## Numbering

```text
NNNN-kebab-case-title.md
```

Next free number: **0008**

## Status values

`Proposed` → `Accepted` → `Superseded` / `Rejected`

## Index

| ADR                                                  | Title                            | Status   |
| ---------------------------------------------------- | -------------------------------- | -------- |
| [0001](./0001-package-independence.md)               | Package independence             | Accepted |
| [0002](./0002-shared-infrastructure-policy.md)       | Shared infrastructure policy     | Accepted |
| [0003](./0003-no-framework-by-default.md)            | No framework by default          | Accepted |
| [0004](./0004-defer-shared-base-error.md)            | Defer shared base error type     | Accepted |
| [0005](./0005-keep-local-event-buses.md)             | Keep Local event buses           | Accepted |
| [0006](./0006-defer-clone-and-plain-object-utils.md) | Defer cloneValue / isPlainObject | Accepted |
| [0007](./0007-reject-shared-store-after-audit.md)    | Reject shared store after audit  | Accepted |
