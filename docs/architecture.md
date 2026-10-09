# Architecture placeholder

The architecture will be finalized after product scope, target hardware, and local-model constraints are measured.

Planned boundaries:

```text
interface
    -> command draft service
        -> local transcription
        -> local parsing and matching
    -> owner review
    -> domain validation
    -> atomic ledger and inventory write
    -> local reporting
```

The interface, AI adapters, domain rules, and persistence layer must remain replaceable at their defined contracts.

