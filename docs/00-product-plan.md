# TindaTala product plan

Status: planning

## Product statement

TindaTala helps sari-sari store owners record sales, utang, payments, expenses, and stock movements through natural spoken or typed commands while keeping core processing and records on the local device.

## Core principle

The AI creates an editable proposal. The owner confirms it. Deterministic code performs every financial and inventory calculation.

## Planning sequence

Each stage must have an approved scope, acceptance criteria, owner, dependencies, risks, and test plan before implementation begins.

1. Product scope and user journeys
2. Domain model and ledger rules
3. Architecture and technology selection
4. Shared contracts and error behavior
5. Manual ledger vertical slice
6. Local speech transcription
7. Transaction parsing and matching
8. Confirmation and correction experience
9. Reporting, inventory, and reversals
10. Offline, performance, and demo validation

## Definition of the first vertical slice

The owner can create a credit sale manually, review it, confirm it once, and see the correct customer balance and inventory movement after restarting the application.

## Definition of the AI vertical slice

In airplane mode, the owner can speak or type a supported Taglish command, receive an editable structured draft, confirm it once, and see deterministic ledger and inventory updates.

## Global acceptance principles

- No AI-generated transaction is persisted before confirmation.
- Prices come from the product catalog or explicit owner input.
- Money uses integer centavos or an equivalent exact decimal representation.
- Related ledger and inventory writes are atomic.
- Confirm requests are idempotent.
- Historical transaction prices do not change with catalog prices.
- Every correction or reversal remains auditable.
- Core workflows remain usable without internet access.

