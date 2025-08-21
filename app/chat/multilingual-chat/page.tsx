'use client';
import { useState } from 'react';
import { Send, Languages as LanguagesIcon, Globe } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  language?: string;
  translation?: string;
}

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' }
];

const greetingExamples = [
  { language: 'Spanish', text: '¡Hola! ¿Cómo estás?', translation: 'Hello! How are you?' },
  { language: 'French', text: 'Bonjour! Comment allez-vous?', translation: 'Hello! How are you?' },
  { language: 'German', text: 'Hallo! Wie geht es Ihnen?', translation: 'Hello! How are you?' },
  { language: 'Japanese', text: 'こんにちは！元気ですか？', translation: 'Hello! How are you?' }
];

export default function MultilingualChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translateTo, setTranslateTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const selectedLang = supportedLanguages.find(lang => lang.code === selectedLanguage);
    
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      language: selectedLang?.name
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response with translation
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        type: 'assistant',
        content: generateMultilingualResponse(inputMessage, selectedLang?.name || 'English'),
        language: selectedLang?.name,
        translation: translateTo ? generateTranslation(inputMessage) : undefined
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const generateMultilingualResponse = (message: string, language: string) => {
    const responses = {
      'English': `Thank you for your message! I understand you're communicating in ${language}. I can help you with conversations, translations, and cultural context across 50+ languages.`,
      'Spanish': `¡Gracias por tu mensaje! Entiendo que te estás comunicando en español. Puedo ayudarte con conversaciones, traducciones y contexto cultural.`,
      'French': `Merci pour votre message! Je comprends que vous communiquez en français. Je peux vous aider avec des conversations, des traductions et le contexte culturel.`,
      'German': `Danke für Ihre Nachricht! Ich verstehe, dass Sie auf Deutsch kommunizieren. Ich kann Ihnen bei Gesprächen, Übersetzungen und kulturellem Kontext helfen.`,
      'Japanese': `メッセージをありがとうございます！日本語でコミュニケーションを取っていることを理解しています。会話、翻訳、文化的コンテキストでお手伝いできます。`
    };
    
    return responses[language as keyof typeof responses] || responses['English'];
  };

  const generateTranslation = (text: string) => {
    return `Translation: "${text}" in the target language would be appropriately translated while maintaining cultural context and nuance.`;
  };

  const useGreetingExample = (example: typeof greetingExamples[0]) => {
    setInputMessage(example.text);
    const lang = supportedLanguages.find(l => l.name === example.language);
    if (lang) setSelectedLanguage(lang.code);
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Multilingual Chat</h1>
        <p className="text-zinc-400">
          Converse in 50+ languages with accurate translation and cultural context understanding.
        </p>
      </div>

      {/* Language Settings */}
      <div className="mb-6 p-4 bg-surface/30 border border-zinc-700 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Input Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-surface border border-zinc-600 rounded-lg px-3 py-2 text-white"
            >
              {supportedLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Translate to (Optional)</label>
            <select
              value={translateTo}
              onChange={(e) => setTranslateTo(e.target.value)}
              className="w-full bg-surface border border-zinc-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="">No translation</option>
              {supportedLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 mb-6 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="inline-flex p-4 rounded-full bg-accent/10 border border-accent/20">
                <LanguagesIcon size={32} className="text-accent" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Ready for Global Conversations</h3>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Start chatting in any of 50+ supported languages. I understand context, culture, and nuance.
            </p>

            {/* Greeting Examples */}
            <div className="max-w-4xl mx-auto mb-8">
              <h4 className="text-lg font-medium text-white mb-4">Try These Greetings:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {greetingExamples.map((example, index) => (
                  <div key={index} className="p-4 bg-surface/30 border border-zinc-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-accent font-medium">{example.language}</span>
                      <button
                        onClick={() => useGreetingExample(example)}
                        className="px-3 py-1 text-sm bg-accent text-black rounded hover:bg-accent/80 transition-colors"
                      >
                        Try This
                      </button>
                    </div>
                    <p className="text-white font-medium mb-1">{example.text}</p>
                    <p className="text-sm text-zinc-400">{example.translation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="p-4 bg-surface/30 border border-zinc-700 rounded-lg">
                <h4 className="font-medium text-white mb-2">🌍 50+ Languages</h4>
                <p className="text-sm text-zinc-400">Support for major world languages</p>
              </div>
              <div className="p-4 bg-surface/30 border border-zinc-700 rounded-lg">
                <h4 className="font-medium text-white mb-2">🎭 Cultural Context</h4>
                <p className="text-sm text-zinc-400">Understands cultural nuances</p>
              </div>
              <div className="p-4 bg-surface/30 border border-zinc-700 rounded-lg">
                <h4 className="font-medium text-white mb-2">🔄 Live Translation</h4>
                <p className="text-sm text-zinc-400">Real-time accurate translation</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl p-4 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-accent text-black'
                      : 'bg-surface border border-zinc-700 text-white'
                  }`}
                >
                  {message.language && (
                    <div className="text-xs opacity-70 mb-2">
                      <Globe size={12} className="inline mr-1" />
                      {message.language}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.translation && (
                    <div className="mt-3 pt-3 border-t border-current/20">
                      <div className="text-xs opacity-70 mb-1">Translation:</div>
                      <p className="text-sm opacity-90">{message.translation}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-2xl p-4 rounded-lg bg-surface border border-zinc-700">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-zinc-400 text-sm">Processing message...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-zinc-400">
            {supportedLanguages.find(l => l.code === selectedLanguage)?.flag} 
            {' '}
            {supportedLanguages.find(l => l.code === selectedLanguage)?.name}
          </span>
          {translateTo && (
            <span className="text-sm text-zinc-400">
              → {supportedLanguages.find(l => l.code === translateTo)?.flag}
              {' '}
              {supportedLanguages.find(l => l.code === translateTo)?.name}
            </span>
          )}
        </div>
        <div className="relative">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message in any language..."
            disabled={isLoading}
            className="w-full bg-surface/70 border border-zinc-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-zinc-500 focus:border-accent focus:outline-none resize-none"
            rows={3}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="absolute bottom-3 right-3 p-2 bg-accent text-black rounded-lg hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
