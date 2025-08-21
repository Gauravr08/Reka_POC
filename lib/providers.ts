export type Provider = 'openai' | 'openrouter';

export const defaultProvider: Provider = process.env.OPENROUTER_API_KEY ? 'openrouter' : 'openai';

export const openAI = {
  baseUrl: 'https://api.openai.com/v1',
  key: process.env.OPENAI_API_KEY,
  chatModel: 'gpt-4o-mini', // text + vision capable
  textModel: 'gpt-4o-mini',
  ttsModel: process.env.OPENAI_TTS_MODEL || 'tts-1',
  sttModel: process.env.OPENAI_STT_MODEL || 'whisper-1',
};

export const openRouter = {
  baseUrl: process.env.OPENROUTER_API_BASE || 'https://openrouter.ai/api/v1',
  key: process.env.OPENROUTER_API_KEY,
  // Change to your preferred OpenRouter models
  chatModel: 'openai/gpt-4o-mini',
  textModel: 'openai/gpt-4o-mini',
};

export const exa = {
  baseUrl: 'https://api.exa.ai',
  key: process.env.EXA_API_KEY,
};

export function assertServerKeys() {
  if (!openAI.key && !openRouter.key) {
    throw new Error('Provide OPENAI_API_KEY or OPENROUTER_API_KEY');
  }
}
