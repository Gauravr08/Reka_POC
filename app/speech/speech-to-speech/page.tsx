'use client';
import { useState, useRef } from 'react';
import { Upload, Mic, FileAudio, MicIcon, Play, Volume2 } from 'lucide-react';

export default function SpeechToSpeech() {
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('zh');
  const [sourceVoice, setSourceVoice] = useState('female');
  const [targetVoice, setTargetVoice] = useState('male');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [outputAudioUrl, setOutputAudioUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' }
  ];

  const voiceOptions = [
    { value: 'male', label: 'Male Voice' },
    { value: 'female', label: 'Female Voice' },
    { value: 'neutral', label: 'Neutral Voice' }
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

  const processSpeechToSpeech = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const sampleConversions = {
        'en-zh': {
          original: "Welcome to our traditional Japanese garden tour. This beautiful space represents centuries of cultural heritage and artistic expression.",
          translated: "欢迎来到我们的传统日式花园之旅。这个美丽的空间代表了几个世纪的文化遗产和艺术表达。"
        },
        'en-es': {
          original: "Welcome to our traditional Japanese garden tour. This beautiful space represents centuries of cultural heritage and artistic expression.",
          translated: "Bienvenidos a nuestro tour del jardín tradicional japonés. Este hermoso espacio representa siglos de patrimonio cultural y expresión artística."
        },
        'ja-en': {
          original: "こんにちは、私たちの伝統的な日本庭園ツアーへようこそ。この美しい空間は何世紀にもわたる文化遺産と芸術的表現を表しています。",
          translated: "Hello, welcome to our traditional Japanese garden tour. This beautiful space represents centuries of cultural heritage and artistic expression."
        }
      };

      const key = `${sourceLanguage}-${targetLanguage}` as keyof typeof sampleConversions;
      const conversion = sampleConversions[key] || sampleConversions['en-zh'];
      
      setOriginalText(conversion.original);
      setTranslatedText(conversion.translated);
      
      // Simulate generating output audio
      setOutputAudioUrl('data:audio/wav;base64,simulated-audio-data');
      setIsProcessing(false);
    }, 4000);
  };

  const loadSampleFile = () => {
    setAudioFile(null);
    setAudioUrl('');
    setOriginalText('');
    setTranslatedText('');
    setOutputAudioUrl('');
    
    setTimeout(() => {
      processSpeechToSpeech();
    }, 1000);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Speech-to-Speech</h1>
        <p className="text-zinc-400">
          Convert speech from one language to another while preserving voice characteristics and natural intonation.
        </p>
      </div>

      {/* Configuration Panel */}
      <div className="mb-6 p-4 bg-surface/30 border border-zinc-700 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source Configuration */}
          <div>
            <h4 className="text-sm font-medium text-zinc-300 mb-3">Source Audio</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Language</label>
                <select
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  className="w-full bg-surface border border-zinc-600 rounded px-3 py-2 text-white text-sm"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Voice Detection</label>
                <select
                  value={sourceVoice}
                  onChange={(e) => setSourceVoice(e.target.value)}
                  className="w-full bg-surface border border-zinc-600 rounded px-3 py-2 text-white text-sm"
                >
                  {voiceOptions.map(voice => (
                    <option key={voice.value} value={voice.value}>{voice.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Target Configuration */}
          <div>
            <h4 className="text-sm font-medium text-zinc-300 mb-3">Target Audio</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Language</label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full bg-surface border border-zinc-600 rounded px-3 py-2 text-white text-sm"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Voice Style</label>
                <select
                  value={targetVoice}
                  onChange={(e) => setTargetVoice(e.target.value)}
                  className="w-full bg-surface border border-zinc-600 rounded px-3 py-2 text-white text-sm"
                >
                  {voiceOptions.map(voice => (
                    <option key={voice.value} value={voice.value}>{voice.label}</option>
                  ))}
                </select>
              </div>
            </div>
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
                <h4 className="text-white font-medium mb-2">Upload or drop audio for speech conversion</h4>
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
                  onClick={processSpeechToSpeech}
                  disabled={isProcessing}
                  className="w-full py-3 bg-accent text-black rounded-lg hover:bg-accent/80 disabled:opacity-50 transition-colors font-medium"
                >
                  {isProcessing ? 'Converting...' : 'Start Speech Conversion'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Output */}
        <div>
          <div className="bg-surface/30 border border-zinc-700 rounded-lg p-6 h-full">
            <div className="flex items-center gap-3 mb-4">
              <MicIcon size={20} className="text-accent" />
              <h3 className="text-lg font-semibold text-white">Translated audio will be ready here</h3>
            </div>

            {isProcessing ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
                  <p className="text-zinc-400">Converting speech...</p>
                  <p className="text-sm text-zinc-500 mt-2">Transcribing, translating, and generating new audio</p>
                </div>
              </div>
            ) : originalText && translatedText ? (
              <div className="space-y-6">
                {/* Original Text */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-zinc-300">Original Speech</span>
                    <span className="text-xs text-zinc-500">
                      {languages.find(l => l.code === sourceLanguage)?.flag} 
                      {' '}
                      {languages.find(l => l.code === sourceLanguage)?.name}
                    </span>
                  </div>
                  <div className="bg-surface/50 border border-zinc-700 rounded-lg p-4">
                    <p className="text-white leading-relaxed text-sm">{originalText}</p>
                  </div>
                </div>

                {/* Translated Text */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-zinc-300">Converted Speech</span>
                    <span className="text-xs text-zinc-500">
                      {languages.find(l => l.code === targetLanguage)?.flag}
                      {' '}
                      {languages.find(l => l.code === targetLanguage)?.name}
                    </span>
                  </div>
                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                    <p className="text-white leading-relaxed text-sm">{translatedText}</p>
                  </div>
                </div>

                {/* Output Audio Player */}
                <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Volume2 size={20} className="text-accent" />
                    <span className="text-white font-medium">Generated Audio</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent/80 transition-colors">
                      <Play size={16} />
                      <span>Play</span>
                    </button>
                    <div className="flex-1 bg-surface/50 rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full w-0"></div>
                    </div>
                    <span className="text-sm text-zinc-400">0:00 / 0:15</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 py-2 bg-surface border border-zinc-600 text-zinc-300 rounded-lg hover:border-zinc-500 transition-colors">
                    Download Audio
                  </button>
                  <button className="flex-1 py-2 bg-surface border border-zinc-600 text-zinc-300 rounded-lg hover:border-zinc-500 transition-colors">
                    Share
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-700">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-400">96%</div>
                    <div className="text-xs text-zinc-400">Voice Quality</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-accent">3.8s</div>
                    <div className="text-xs text-zinc-400">Process Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-accent">15s</div>
                    <div className="text-xs text-zinc-400">Audio Length</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <MicIcon size={48} className="mx-auto text-zinc-600 mb-4" />
                  <p className="text-zinc-400">Converted audio will appear here</p>
                  <p className="text-sm text-zinc-500 mt-2">Upload audio or start recording to begin conversion</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
