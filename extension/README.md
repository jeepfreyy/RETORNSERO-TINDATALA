# Kaya Mode

Chrome/Edge Manifest V3 extension explaining web forms with **local Qwen 2.5 3B
through Ollama**. No build, cloud model, API key, account, or form submission.
Requires Chrome/Edge 126+; setup/test scripts use Node.js 22+.

## Start here

Follow [Windows/macOS setup](../docs/kaya-setup.md). Load this folder unpacked
from chrome://extensions, start Ollama, run `node scripts/serve-kaya-demo.mjs`
from the repo root, and open http://localhost:4173. Open Kaya Mode from the
toolbar, select **Check local AI**, then **Analyze**.

Default mode reads the current page and runs real local inference. Sample mode
is an explicit, labeled dropdown choice; it never substitutes for a failed live
request. Keep the popup open while analysis runs. Cancel or close it to abort.
Results are held in popup memory only and disappear when it closes.

## Architecture

```text
Analyze -> isolated form reader -> runtime port -> background worker
  -> localhost Ollama/Qwen -> validated JSON -> overview/checklist/first step
```

- form-reader.js / form-reader-client.js: on-demand field metadata.
- ollama.js: bounded prompt, streaming, validation, timeouts, and errors.
- background.js: sender checks, one active request, cancellation.
- local-ai-client.js: request-scoped heartbeat and disconnect handling.
- analysis-service.js: explicit live/sample routing and user-facing errors.
- popup.*, styles.css, setup.*: interface and offline setup guide.

Results include model name, request duration, Ollama-reported inference duration,
field count, and prompt-shortening status. All model text is displayed as plain
text. See [reader contract](FORM_READER.md).

## Permissions

activeTab gives temporary page access after the toolbar action; scripting runs
the reader in the main frame's isolated world. The only persistent host access
is http://localhost:11434/*. No broad site permissions, analytics, remote
scripts, or cloud fallback.

The manifest's public key gives a stable extension ID:
`ojmclkkncanmfmkkbilgmcmcfbnfaoid`. It is not a credential. Setup scripts allow
this exact extension origin, bind Ollama to loopback, and disable cloud features.
Runtime binaries, model weights, and browser-test profiles are ignored by Git.

## Tests

Unit tests need no packages: `npm test --prefix extension`.
For browser tests, install dependencies with `npm ci --prefix extension`, then:

```sh
npm run test:browser --prefix extension
npm run test:reader --prefix extension
npm run test:live --prefix extension
```

Browser tests use installed Chrome. The first two also support
KAYA_BROWSER_CHANNEL=chromium after installing Playwright Chromium. Live testing
requires recent Chrome with CDP extension APIs and local Ollama/Qwen. It loads
the production manifest in a disposable profile and triggers the actual action
to grant activeTab, then tests the same popup document in a tab because headless
Chrome does not expose the toolbar bubble as a Playwright page. The reader,
worker, model request, privacy checks, cancellation, and errors are real.

Outputs go to ignored test-results/; profiles go to ignored .kaya-runtime/.
See [verification and limits](../docs/kaya-verification.md). Custom widgets,
shadow roots, iframes, PDFs, and instructions outside field metadata are outside
the MVP. Sites can put personal information in labels/placeholders; use fictional
data for demos and check actual form instructions.
