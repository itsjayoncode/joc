# 016 Package Checklist

## Why This Document Exists

This checklist defines the minimum bar a JOC package should satisfy before release.

## Structure

- [ ] Package folder follows the standard architecture
- [ ] `package.json` metadata is complete
- [ ] `README.md` follows the package documentation standard
- [ ] `CHANGELOG.md` exists and is current
- [ ] `LICENSE` is present

## API and Typing

- [ ] Public API is intentional and documented
- [ ] Internal APIs are not leaked accidentally
- [ ] TypeScript types are clear and stable
- [ ] Export surface is explicit and tree-shakeable

## Testing

- [ ] Unit tests exist
- [ ] Integration tests exist when applicable
- [ ] Coverage goals are met for meaningful behavior
- [ ] Fixtures and test helpers are organized predictably

## Documentation and Examples

- [ ] Installation guidance is complete
- [ ] Quick start guidance is complete
- [ ] Examples are reviewed and verified
- [ ] Browser or runtime support is documented
- [ ] Breaking changes and migration notes are documented when needed
- [ ] Versioned docs archives are enabled (package registered in `DOC_VERSIONED_PACKAGES`, manifest under `apps/docs/doc-versions/`, version switcher wired) — **required by default**
- [ ] First release bootstrapped with `pnpm docs:archive -- --package <id> --bootstrap` so the version dropdown is not empty

## Release Readiness

- [ ] Build succeeds
- [ ] Package passes linting and tests
- [ ] Changeset is added when required
- [ ] Changelog reflects user-facing impact
- [ ] Version bump matches SemVer expectations
