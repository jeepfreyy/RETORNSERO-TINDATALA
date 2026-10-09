import { analyzeWithOllama, checkOllama } from './ollama.js';

let busy = false;
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'kaya-analysis' || port.sender?.id !== chrome.runtime.id
    || port.sender?.url !== chrome.runtime.getURL('popup.html')) { port.disconnect(); return; }
  let controller;
  let disconnected = false;
  let used = false;
  const send = (message) => { if (!disconnected) port.postMessage(message); };
  port.onDisconnect.addListener(() => { disconnected = true; controller?.abort(); });
  port.onMessage.addListener(async (message) => {
    if (message.type === 'ping') { send({ type: 'pong' }); return; }
    if (message.type === 'cancel') { controller?.abort(); return; }
    if (!['analyze', 'check'].includes(message.type) || used) return;
    used = true;
    if (busy) { send({ type: 'error', code: 'AI_BUSY' }); return; }
    busy = true;
    controller = new AbortController();
    try {
      const result = message.type === 'check'
        ? await checkOllama({ signal: controller.signal })
        : await analyzeWithOllama(message.metadata, { signal: controller.signal });
      send({ type: 'result', result });
    } catch (error) {
      send({ type: 'error', code: error.code || 'AI_FAILED' });
    } finally { busy = false; }
  });
});
