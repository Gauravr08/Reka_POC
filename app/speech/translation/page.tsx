'use client';
import { useState, useRef } from 'react';
import { Upload, Mic, FileAudio, RotateCcw } from 'lucide-react';

export default function Translation() {
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('zh');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
    }, 5000);
  };

  const processTranslation = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const sampleTranslations = {
        'en-zh': {
          original: "Good morning, this is the BBC World Service with breaking news from around the globe. Today's headlines include major developments in international trade negotiations.",
          translated: "早上好，这里是BBC世界服务，为您播报来自全球的突发新闻。今天的头条新闻包括国际贸易谈判的重大进展。"
        },
        'en-es': {
          original: "Good morning, this is the BBC World Service with breaking news from around the globe. Today's headlines include major developments in international trade negotiations.",
          translated: "Buenos días, este es el Servicio Mundial de la BBC con noticias de última hora de todo el mundo. Los titulares de hoy incluyen desarrollos importantes en las negociaciones comerciales internacionales."
        },
        'en-fr': {
          original: "Good morning, this is the BBC World Service with breaking news from around the globe. Today's headlines include major developments in international trade negotiations.",
          translated: "Bonjour, ici le BBC World Service avec des nouvelles de dernière minute du monde entier. Les gros titres d'aujourd'hui incluent des développements majeurs dans les négociations commerciales internationales."
        }
      };

      const key = `${sourceLanguage}-${targetLanguage}` as keyof typeof sampleTranslations;
      const translation = sampleTranslations[key] || sampleTranslations['en-zh'];
      
      setOriginalText(translation.original);
      setTranslatedText(translation.translated);
      setIsProcessing(false);
    }, 3000);
  };

  const loadSampleFile = () => {
    setAudioFile(null);
    setAudioUrl('');
    setOriginalText('');
    setTranslatedText('');
    
    setTimeout(() => {
      processTranslation();
    }, 1000);
  };

  const swapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Translation</h1>
        <p className="text-zinc-400">
          Translate speech from one language to another, perfect for fast-paced content like news segments.
        </p>
      </div>

      {/* Language Selection */}
      <div className="mb-6 p-4 bg-surface/30 border border-zinc-700 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">From</label>
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="w-full bg-surface border border-zinc-600 rounded-lg px-3 py-2 text-white"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={swapLanguages}
              className="p-2 bg-surface border border-zinc-600 rounded-lg text-zinc-400 hover:text-accent hover:border-accent transition-colors"
            >
              <RotateCcw size={20} />
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">To</label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full bg-surface border border-zinc-600 rounded-lg px-3 py-2 text-white"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Audio Input */}
        <div>
          <div className="bg-surface/30 border border-zinc-700 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Audio Input</h3>
            
            {/* File Upload */}
            <div className="mb-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:border-accent/50 transition-colors cursor-pointer"
              >
                <FileAudio size={48} className="mx-auto text-zinc-500 mb-4" />
                <h4 className="text-white font-medium mb-2">Upload or drop audio for translation</h4>
                <p className="text-sm text-zinc-400 mb-4">Max. file size 10 MB or use a</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    loadSampleFile();
                  }}
                  className="text-accent hover:underline"
                >
                  Sample file
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Audio Preview */}
            {audioUrl && (
              <div className="mb-6 p-4 bg-surface/50 border border-zinc-700 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <FileAudio size={20} className="text-accent" />
                  <span className="text-white text-sm">{audioFile?.name}</span>
                </div>
                <audio controls className="w-full">
                  <source src={audioUrl} type="audio/*" />
                </audio>
              </div>
            )}

            {/* OR Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-zinc-700"></div>
              <span className="text-zinc-400 text-sm">or</span>
              <div className="flex-1 h-px bg-zinc-700"></div>
            </div>

            {/* Recording */}
            <div className="text-center">
              <button
                onClick={startRecording}
                disabled={isRecording}
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-2 transition-colors ${
                  isRecording
                    ? 'border-red-500 bg-red-500/10 text-red-400'
                    : 'border-accent bg-accent/10 text-accent hover:bg-accent/20'
                }`}
              >
                <Mic size={32} />
              </button>
              <p className="text-sm text-zinc-400 mt-4">
                {isRecording ? 'Recording...' : 'Click to start recording'}
              </p>
            </div>

            {/* Process Button */}
            {(audioFile || isRecording) && (
              <div className="mt-6">
                <button
                  onClick={processTranslation}
                  disabled={isProcessing}
                  className="w-full py-3 bg-accent text-black rounded-lg hover:bg-accent/80 disabled:opacity-50 transition-colors font-medium"
                >
                  {isProcessing ? 'Translating...' : 'Start Translation'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Translation Output */}
        <div>
          <div className="bg-surface/30 border border-zinc-700 rounded-lg p-6 h-full">
            <div className="flex items-center gap-3 mb-4">
              <RotateCcw size={20} className="text-accent" />
              <h3 className="text-lg font-semibold text-white">Translation</h3>
            </div>

            {isProcessing ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
                  <p className="text-zinc-400">Translating audio...</p>
                  <p className="text-sm text-zinc-500 mt-2">Processing speech and converting to target language</p>
                </div>
              </div>
            ) : originalText && translatedText ? (
              <div className="space-y-6">
                {/* Original Text */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-zinc-300">Original</span>
                    <span className="text-xs text-zinc-500">
                      {languages.find(l => l.code === sourceLanguage)?.flag} 
                      {' '}
                      {languages.find(l => l.code === sourceLanguage)?.name}
                    </span>
                  </div>
                  <div className="bg-surface/50 border border-zinc-700 rounded-lg p-4">
                    <p className="text-white leading-relaxed">{originalText}</p>
                  </div>
                </div>

                {/* Translated Text */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-zinc-300">Translation</span>
                    <span className="text-xs text-zinc-500">
                      {languages.find(l => l.code === targetLanguage)?.flag}
                      {' '}
                      {languages.find(l => l.code === targetLanguage)?.name}
                    </span>
                  </div>
                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                    <p className="text-white leading-relaxed">{translatedText}</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 py-2 bg-surface border border-zinc-600 text-zinc-300 rounded-lg hover:border-zinc-500 transition-colors">
                    Copy Translation
                  </button>
                  <button className="flex-1 py-2 bg-surface border border-zinc-600 text-zinc-300 rounded-lg hover:border-zinc-500 transition-colors">
                    Download
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-700">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-400">98%</div>
                    <div className="text-xs text-zinc-400">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-accent">2.3s</div>
                    <div className="text-xs text-zinc-400">Process Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-accent">{originalText.split(' ').length}</div>
                    <div className="text-xs text-zinc-400">Words</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <RotateCcw size={48} className="mx-auto text-zinc-600 mb-4" />
                  <p className="text-zinc-400">Translation will appear here</p>
                  <p className="text-sm text-zinc-500 mt-2">Upload audio or start recording to begin translation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
