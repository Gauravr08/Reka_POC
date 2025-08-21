'use client';
import { useState, useRef } from 'react';
import { Upload, Mic, Play, Pause, FileAudio, FileText } from 'lucide-react';

export default function Transcription() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
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
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' }
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
    // Simulate recording
    setTimeout(() => {
      setIsRecording(false);
    }, 5000);
  };

  const processAudio = () => {
    setIsProcessing(true);
    
    // Simulate transcription processing
    setTimeout(() => {
      const sampleTranscripts = [
        "Hello, this is a sample voicemail. I'm calling to discuss the project details and would like to schedule a meeting for next week. Please let me know your availability.",
        "The weather forecast for tomorrow shows partly cloudy skies with a high of 75 degrees. There's a slight chance of rain in the evening, so you might want to bring an umbrella.",
        "Thank you for your recent purchase. Your order has been processed and will be shipped within 2-3 business days. You will receive a tracking number via email.",
        "This is a test of the emergency broadcast system. This is only a test. In case of an actual emergency, you would be instructed where to tune for information."
      ];
      
      const randomTranscript = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];
      setTranscript(randomTranscript);
      setIsProcessing(false);
    }, 3000);
  };

  const loadSampleFile = () => {
    setAudioFile(null);
    setAudioUrl('');
    setTranscript('');
    
    // Simulate loading a sample file
    setTimeout(() => {
      setTranscript("Hello, this is a sample voicemail with some background noise and mumbling. The speaker might be in a noisy environment, but our AI can still accurately transcribe the content even with these challenging audio conditions.");
    }, 1000);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Transcription</h1>
        <p className="text-zinc-400">
          Convert speech to accurate text, even in noisy conditions with background sounds and mumbling.
        </p>
      </div>

      {/* Language Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-zinc-300 mb-2">Select Language</label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="bg-surface border border-zinc-700 rounded-lg px-4 py-2 text-white w-48"
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
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
                <h4 className="text-white font-medium mb-2">Upload or drop audio for transcription</h4>
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
                  onClick={processAudio}
                  disabled={isProcessing}
                  className="w-full py-3 bg-accent text-black rounded-lg hover:bg-accent/80 disabled:opacity-50 transition-colors font-medium"
                >
                  {isProcessing ? 'Processing...' : 'Start Transcription'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Transcript Output */}
        <div>
          <div className="bg-surface/30 border border-zinc-700 rounded-lg p-6 h-full">
            <div className="flex items-center gap-3 mb-4">
              <FileText size={20} className="text-accent" />
              <h3 className="text-lg font-semibold text-white">Transcript</h3>
            </div>

            {isProcessing ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
                  <p className="text-zinc-400">Transcribing audio...</p>
                  <p className="text-sm text-zinc-500 mt-2">This may take a few moments</p>
                </div>
              </div>
            ) : transcript ? (
              <div className="space-y-4">
                <div className="bg-surface/50 border border-zinc-700 rounded-lg p-4">
                  <p className="text-white leading-relaxed">{transcript}</p>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 py-2 bg-surface border border-zinc-600 text-zinc-300 rounded-lg hover:border-zinc-500 transition-colors">
                    Copy Text
                  </button>
                  <button className="flex-1 py-2 bg-surface border border-zinc-600 text-zinc-300 rounded-lg hover:border-zinc-500 transition-colors">
                    Download
                  </button>
                </div>

                {/* Confidence & Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-700">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-400">95%</div>
                    <div className="text-xs text-zinc-400">Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-accent">{transcript.split(' ').length}</div>
                    <div className="text-xs text-zinc-400">Words</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <FileText size={48} className="mx-auto text-zinc-600 mb-4" />
                  <p className="text-zinc-400">Transcript will appear here</p>
                  <p className="text-sm text-zinc-500 mt-2">Upload audio or start recording to begin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
