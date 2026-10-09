# TindaTala

TindaTala is an offline-first, voice-assisted ledger for sari-sari stores.

This repository currently contains the planned product boundaries and placeholder files only. Implementation will proceed one approved stage at a time.

## Start here

1. Read `docs/00-product-plan.md`.
2. Resolve the decisions in `docs/01-decision-register.md`.
3. Complete and approve the relevant stage brief before implementation.
4. Record material changes in `docs/02-decision-log.md`.

## Product boundaries

- The AI proposes structured transactions.
- The owner reviews and confirms every proposal.
- Deterministic application code calculates money, balances, and inventory.
- The local database is the source of truth.
- Core workflows must operate without an internet connection.

## Repository areas

- `frontend/` — user interface placeholders
- `backend/` — local API, AI adapters, domain rules, and persistence placeholders
- `contracts/` — shared API and data-contract placeholders
- `fixtures/` — fictional demo and test data placeholders
- `models/` — local model manifests and setup notes; weights are not committed
- `scripts/` — setup, launch, seeding, and offline-verification placeholders
- `tests/` — planned validation suites
- `docs/` — product plan, decisions, stage briefs, and demo planning

