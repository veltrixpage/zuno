/**
 * Prática de pronúncia.
 *
 * Gravar: usa o microfone do aparelho (MediaRecorder), real.
 * Analisar: depende de um serviço externo de reconhecimento de fala no
 * SERVIDOR (POST {apiBase}/pronunciation). Sem ele, a análise NÃO acontece
 * e a tela diz isso; nenhuma nota é inventada.
 *
 * Formato do resultado esperado do servidor:
 * { pronunciation: 0-100, clarity: 0-100,
 *   words: [{ word, ok: boolean, heard?: string }],
 *   tips: ["ponto para melhorar", ...] }
 */
import { backendStatus, apiUrl, authToken } from '../ai/backendStatus.js';

export const PronunciationService = {
  canRecord() {
    return Boolean(navigator.mediaDevices?.getUserMedia && typeof window.MediaRecorder === 'function');
  },

  async analysisReady() {
    return (await backendStatus()).stt;
  },

  /** Grava até `maxMs`. Devolve { stop(): Promise<Blob> }. */
  async start(maxMs = 8000) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream);
    const chunks = [];
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    const done = new Promise((resolve) => {
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        resolve(new Blob(chunks, { type: rec.mimeType || 'audio/webm' }));
      };
    });
    rec.start();
    const timer = setTimeout(() => rec.state === 'recording' && rec.stop(), maxMs);
    return {
      stop() {
        clearTimeout(timer);
        if (rec.state === 'recording') rec.stop();
        return done;
      },
    };
  },

  async analyze(blob, { text, code }) {
    if (!(await this.analysisReady())) {
      const err = new Error('A análise de pronúncia ainda não está configurada.');
      err.code = 'not_configured';
      throw err;
    }
    const form = new FormData();
    form.append('audio', blob, 'gravacao.webm');
    form.append('text', text);
    form.append('language', code);
    const res = await fetch(apiUrl('/pronunciation'), {
      method: 'POST',
      headers: authToken() ? { Authorization: `Bearer ${authToken()}` } : {},
      body: form,
    });
    if (!res.ok) throw new Error('Não foi possível analisar agora.');
    return res.json();
  },
};
