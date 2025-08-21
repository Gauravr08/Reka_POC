// API Configuration

export const apiConfig = {
  // File upload limits
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '50') * 1024 * 1024, // 50MB default
    allowedAudioFormats: (process.env.ALLOWED_AUDIO_FORMATS || 'mp3,wav,m4a,ogg,flac').split(','),
    allowedImageFormats: (process.env.ALLOWED_IMAGE_FORMATS || 'jpg,jpeg,png,gif,webp').split(','),
    allowedDocumentFormats: (process.env.ALLOWED_DOCUMENT_FORMATS || 'pdf,txt,md,docx').split(','),
  },

  // Rate limiting
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: parseInt(process.env.RATE_LIMIT_RPM || '60'),
  },

  // Model configurations
  models: {
    openai: {
      chat: 'gpt-4o-mini',
      vision: 'gpt-4o-mini',
      text: 'gpt-4o-mini',
      tts: process.env.OPENAI_TTS_MODEL || 'tts-1',
      stt: process.env.OPENAI_STT_MODEL || 'whisper-1',
    },
    openrouter: {
      chat: 'openai/gpt-4o-mini',
      vision: 'openai/gpt-4o-mini', 
      text: 'openai/gpt-4o-mini',
    },
  },

  // TTS Voice options
  voices: {
    openai: ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'],
    azure: ['en-US-AriaNeural', 'en-US-JennyNeural', 'en-US-GuyNeural'],
  },

  // Language codes for translation
  languages: {
    auto: 'auto-detect',
    en: 'english',
    es: 'spanish',
    fr: 'french',
    de: 'german',
    it: 'italian',
    pt: 'portuguese',
    ru: 'russian',
    ja: 'japanese',
    ko: 'korean',
    zh: 'chinese',
    ar: 'arabic',
    hi: 'hindi',
  },

  // Vision analysis types
  visionAnalysis: {
    comprehensive: 'Detailed analysis of all visual elements',
    focused: 'Targeted analysis based on specific queries',
    technical: 'Technical details like metadata, composition, quality',
    creative: 'Creative and artistic analysis',
    accessibility: 'Accessibility and descriptive analysis',
  },

  // Research types
  researchTypes: {
    analysis: 'Analytical research with insights and conclusions',
    summary: 'Summarized overview of key points',
    comparison: 'Comparative analysis between sources',
    synthesis: 'Synthesized information from multiple sources',
    validation: 'Fact-checking and validation of information',
  },

  // Search types
  searchTypes: {
    neural: 'AI-powered semantic search',
    keyword: 'Traditional keyword-based search',
    visual: 'Visual and image-based search',
    academic: 'Academic and research-focused search',
    news: 'News and current events search',
  },

  // Error messages
  errors: {
    missingApiKey: 'API key is required but not provided',
    invalidFileType: 'File type not supported',
    fileTooLarge: 'File size exceeds maximum limit',
    rateLimitExceeded: 'Rate limit exceeded, please try again later',
    invalidRequest: 'Invalid request format or parameters',
    serviceUnavailable: 'Service temporarily unavailable',
    processingError: 'Error processing your request',
  },

  // Feature flags
  features: {
    enableRateLimit: process.env.NODE_ENV === 'production',
    enableAnalytics: process.env.NODE_ENV === 'production',
    enableCaching: process.env.NODE_ENV === 'production',
    enableDebugLogs: process.env.NODE_ENV === 'development',
  },

  // Timeouts (in milliseconds)
  timeouts: {
    transcription: 120000, // 2 minutes
    translation: 60000, // 1 minute
    tts: 60000, // 1 minute
    analysis: 120000, // 2 minutes
    search: 30000, // 30 seconds
    chat: 60000, // 1 minute
  },
};

export type ApiConfig = typeof apiConfig;
export type VisionAnalysisType = keyof typeof apiConfig.visionAnalysis;
export type ResearchType = keyof typeof apiConfig.researchTypes;
export type SearchType = keyof typeof apiConfig.searchTypes;
