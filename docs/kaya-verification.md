# Kaya Mode verification

## Recorded local run — 2026-10-09

All 19 unit checks passed, along with the UI and reader browser suites.
The live extension test passed using the production manifest and the actual
Chrome action to grant activeTab. Real Qwen analyzed eight practice-form fields
in 28.5 seconds and returned the overview, checklist, and first step. Typed name,
email, and notes sentinels were absent from the model request. Cancellation,
missing-form handling, and localhost-only observed requests also passed.

The screenshot was visually reviewed. This run does not certify macOS or a
physically disconnected network; those final manual checks remain below.

## Automated coverage

- Unit: live/sample separation, sanitized/bounded prompts, streamed JSON and
  Unicode, invalid/truncated output, connection errors, missing model, origin
  rejection, busy server, cancellation, and timeout.
- UI: keyboard flow, loading, samples, errors/retry, checklist reset, popup
  sizing, reduced motion, and no remote requests in sample mode.
- Reader: accessible/native labels, hidden/password exclusions, unchanged metadata
  after editing/uploading, dynamic/empty forms, limits, and no native value reads.
- Live: production manifest and real action/activeTab grant, popup document in a
  tab (headless toolbar bubbles are not Playwright pages), isolated extraction,
  background messaging, real Qwen generation, results, cancellation, missing
  forms, and localhost-only observed traffic.

Outputs are local and ignored: test-results/live-result.txt and
test-results/kaya-live.png. Runtime/models/test profiles: .kaya-runtime/.

## Manual demo checklist

- [ ] Reload in the presenter's normal browser profile.
- [ ] Open practice form, Check local AI, Analyze, read all three sections.
- [ ] Change fictional values; confirm guidance concerns metadata.
- [ ] Test no-form page, cancellation, and retry.
- [ ] Stop Ollama, check unavailable error, restart, retry.
- [ ] Disconnect internet (retain localhost) and repeat.
- [ ] Reproduce macOS setup if using a Mac for the demo.

Local hardware: Windows, 16 GB RAM, RTX 3050 Laptop GPU (4 GB). Runtime/model:
Ollama 0.40.2 and Qwen 2.5 3B Q4_K_M. Mac execution is not claimed.

## Limits

Native main-frame fields only. Custom widgets, iframes, shadow roots, PDFs, and
instructions outside metadata may be missed. Reader limits: 50 fields, 200
characters per string, 30 options. Model input additionally has an 8,000-character
cap and reports shortening. The result warns it may only cover part of a form.

Entered values are not read, but a site can mirror personal data into labels or
placeholders. Page text is untrusted. Prompt safeguards cannot guarantee model
correctness: check actual requirements. No filling/submission, persisted result
storage, or cloud fallback.
