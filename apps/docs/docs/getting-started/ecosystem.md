# Ecosystem

JOC is one repository, but it is not one library.

## Repository areas

- `apps/` contains first-party applications such as this docs site and the playground.
- `packages/` contains future public libraries and internal shared workspace code.
- `examples/` contains future example references.
- `templates/` contains reusable scaffolds such as the standard JOC package template.
- `engineering/` documents the architectural and operational model.
- `.github/` contains the collaboration and automation layer.

## Growth model

JOC is expected to grow into many packages over time. The repository is structured so new packages can be added without redesigning the docs, tooling, or automation around them.

## Documentation model

Each planned package gets a stable placeholder page early. That keeps navigation and information architecture consistent even before implementation begins.
