/**
 * Catálogo de idiomas (espelha a tabela `languages`).
 * code: código ISO do idioma · flag: país da bandeira · tag: atributo lang do HTML
 */
export const LANGUAGES = [
  { code: 'en', name: 'Inglês', native: 'English', flag: 'us', tag: 'en' },
  { code: 'es', name: 'Espanhol', native: 'Español', flag: 'es', tag: 'es' },
  { code: 'it', name: 'Italiano', native: 'Italiano', flag: 'it', tag: 'it' },
  { code: 'fr', name: 'Francês', native: 'Français', flag: 'fr', tag: 'fr' },
  { code: 'de', name: 'Alemão', native: 'Deutsch', flag: 'de', tag: 'de' },
  { code: 'ja', name: 'Japonês', native: '日本語', flag: 'jp', tag: 'ja' },
  { code: 'ko', name: 'Coreano', native: '한국어', flag: 'kr', tag: 'ko' },
  { code: 'zh', name: 'Mandarim', native: '中文', flag: 'cn', tag: 'zh-Hans' },
  { code: 'pt', name: 'Português', native: 'Português', flag: 'pt', tag: 'pt' },
];

export const getLanguage = (code) => LANGUAGES.find((l) => l.code === code) || null;
