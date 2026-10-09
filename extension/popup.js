import { analyzeForm, getErrorMessage, validateAnalysis } from './analysis-service.js';
import { requestLocalAI } from './local-ai-client.js';

const elements = Object.fromEntries([
  'assistant', 'analyze-form', 'scenario', 'analyze-button', 'button-label',
  'spinner', 'button-arrow', 'status', 'error', 'error-title', 'error-message',
  'results', 'results-title', 'overview', 'checklist', 'first-step',
  'mode-badge', 'notice-title', 'notice-copy', 'result-source', 'result-meta',
  'results-footnote', 'cancel-button', 'check-ai',
].map((id) => [id, document.getElementById(id)]));

let isLoading = false;
let controller;

function setLoading(loading) {
  isLoading = loading;
  elements.assistant.setAttribute('aria-busy', String(loading));
  elements['analyze-button'].disabled = loading;
  elements.scenario.disabled = loading;
  elements['check-ai'].disabled = loading;
  elements['cancel-button'].hidden = !loading;
  elements.spinner.hidden = !loading;
  elements['button-arrow'].hidden = loading;
  elements['button-label'].textContent = loading ? 'Preparing guidance…' : 'Analyze';
}

function renderResults(result) {
  validateAnalysis(result);
  const sample = result.source === 'sample';
  elements['result-source'].textContent = sample ? 'SAMPLE AI RESPONSE' : 'LOCAL AI RESPONSE';
  elements['result-meta'].textContent = sample ? 'Fictional example · no page was read'
    : `${result.model} · ${(result.durationMs / 1000).toFixed(1)}s · ${result.fieldCount} fields${result.truncated ? ' · shortened to fit' : ''}`;
  elements['results-footnote'].textContent = sample ? 'Example only. Always follow the actual form’s instructions.'
    : 'Based on supported fields only. Check the actual form’s instructions; AI can make mistakes.';
  elements.overview.textContent = result.overview;
  elements['first-step'].textContent = result.firstStep;
  elements.checklist.replaceChildren();
  for (const item of result.preparationChecklist) {
    const row = document.createElement('li');
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    const text = document.createElement('span');
    text.textContent = item;
    label.append(checkbox, text);
    row.append(label);
    elements.checklist.append(row);
  }
  elements.results.hidden = false;
}

elements['analyze-form'].addEventListener('submit', async (event) => {
  event.preventDefault();
  if (isLoading) return;

  elements.error.hidden = true;
  elements.results.hidden = true;
  setLoading(true);
  controller = new AbortController();
  const sample = elements.scenario.value !== 'live';
  elements.status.textContent = sample ? 'Preparing a sample response. No page content is being read.' : 'Reading this form…';

  try {
    const result = await analyzeForm({ scenario: elements.scenario.value, signal: controller.signal,
      onStatus: (message) => { elements.status.textContent = message; } });
    renderResults(result);
    elements.status.textContent = `${sample ? 'Sample' : 'Analysis'} ready. Your overview, checklist, and first step are below.`;
  } catch (error) {
    const { title, message } = getErrorMessage(error);
    elements['error-title'].textContent = title;
    elements['error-message'].textContent = message;
    elements.error.hidden = false;
    elements.status.textContent = error.code === 'CANCELLED' ? 'Cancelled. No form fields were changed.' : 'No results to show. See the message below and try again.';
  } finally {
    setLoading(false);
  }
  if (!elements.results.hidden) elements['results-title'].focus();
});

elements.scenario.addEventListener('change', () => {
  elements.results.hidden = true;
  elements.error.hidden = true;
  const sample = elements.scenario.value !== 'live';
  elements['mode-badge'].textContent = sample ? 'SAMPLE MODE' : 'LOCAL AI';
  elements['notice-title'].textContent = sample ? 'Sample AI responses · demo only' : 'Your form, a little clearer';
  elements['notice-copy'].textContent = sample
    ? 'Fictional examples, not analysis of this page. No page content is read or sent in sample mode.'
    : 'Only field labels and requirements go to Ollama on this computer. Entered values, passwords, and uploaded files are excluded.';
  elements.status.textContent = sample ? 'Sample selected. Select Analyze when you’re ready.' : 'Open a form, then select Analyze. Keep this popup open while it runs.';
});

elements['cancel-button'].addEventListener('click', () => controller?.abort());
elements['check-ai'].addEventListener('click', async () => {
  if (isLoading) return;
  elements.error.hidden = true;
  controller = new AbortController();
  setLoading(true);
  elements.status.textContent = 'Checking local Ollama and the model…';
  try {
    const result = await requestLocalAI('check', undefined, { signal: controller.signal });
    elements.status.textContent = `${result.model} is available locally. Open a form and select Analyze.`;
  } catch (error) {
    const { title, message } = getErrorMessage(error);
    elements['error-title'].textContent = title;
    elements['error-message'].textContent = message;
    elements.error.hidden = false;
    elements.status.textContent = 'Local AI check did not complete. See the message below.';
  } finally { setLoading(false); }
});
