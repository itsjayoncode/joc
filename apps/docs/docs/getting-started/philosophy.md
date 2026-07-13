# Philosophy

JOC is designed around a few non-negotiable ideas.

## Foundation before features

Repository quality, contributor experience, and architectural clarity come before package implementation.

## Public packages stay independent

Future public JOC packages should remain installable without pulling in other public JOC packages as hidden requirements.

## Internal reuse stays internal

If many packages need the same internal building blocks, those belong in the internal `shared` workspace package rather than being duplicated or exposed accidentally.

## Open source readiness matters early

The repository should explain itself through:

- folder structure
- documentation
- contributor guidance
- automation

This lowers the cost of collaboration before the first public release.
