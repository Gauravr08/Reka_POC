'use client';
import { useState } from 'react';
import { Youtube, Upload, Send } from 'lucide-react';

export default function ReelGeneration() {
  const [sourceType, setSourceType] = useState<'youtube' | 'upload'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [template, setTemplate] = useState<'specific' | 'compilation'>('specific');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [generateHashtags, setGenerateHashtags] = useState(true);
  const [generateCaptions, setGenerateCaptions] = useState(true);
  const [prompt, setPrompt] = useState('Which moments should we include...');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reel Generation</h1>
        <p className="text-zinc-400">
          Effortlessly turn videos into intelligent, meaningful content.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Configuration</h3>
            
            {/* Source */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-300 mb-3">Source</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSourceType('youtube')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    sourceType === 'youtube' 
                      ? 'border-accent bg-accent/10 text-accent' 
                      : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  <Youtube size={16} />
                  Youtube
                </button>
                <button
                  onClick={() => setSourceType('upload')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    sourceType === 'upload' 
                      ? 'border-accent bg-accent/10 text-accent' 
                      : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  <Upload size={16} />
                  Upload
                </button>
              </div>
            </div>

            {/* URL Input */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Enter your YouTube video URL"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full bg-surface/70 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-accent focus:outline-none"
              />
            </div>

            {/* Template */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-300 mb-3">Template</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTemplate('specific')}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    template === 'specific' 
                      ? 'border-accent bg-accent/10 text-accent' 
                      : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  Specific Moment
                </button>
                <button
                  onClick={() => setTemplate('compilation')}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    template === 'compilation' 
                      ? 'border-accent bg-accent/10 text-accent' 
                      : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  Compilation
                </button>
              </div>
            </div>

            {/* Toggle Options */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Generate Hashtags</span>
                <button
                  onClick={() => setGenerateHashtags(!generateHashtags)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    generateHashtags ? 'bg-accent' : 'bg-zinc-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    generateHashtags ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">Generate Captions</span>
                <button
                  onClick={() => setGenerateCaptions(!generateCaptions)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    generateCaptions ? 'bg-accent' : 'bg-zinc-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    generateCaptions ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-300 mb-3">Aspect Ratio</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="bg-surface/70 border border-zinc-700 rounded-lg px-3 py-2 text-white w-20"
                />
                <button className="px-4 py-2 bg-zinc-800 text-white rounded-lg border border-zinc-700">
                  Original
                </button>
              </div>
            </div>

            {/* Video Length */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-300 mb-3">Video Length</label>
              <p className="text-sm text-zinc-400 mb-3">Suggested Prompts:</p>
              <div className="flex gap-2 mb-3">
                <button className="px-3 py-2 bg-surface border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:border-accent">
                  High-Energy Preview
                </button>
                <button className="px-3 py-2 bg-surface border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:border-accent">
                  Fast-Paced Montage
                </button>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-surface/70 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-accent focus:outline-none h-24 resize-none"
                placeholder="Which moments should we include..."
              />
              <button className="mt-3 flex items-center gap-2 px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent/90 transition-colors">
                <Send size={16} />
                Generate
              </button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-surface/50 rounded-2xl border border-zinc-800 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-48 h-48 bg-zinc-800 rounded-full flex items-center justify-center mb-4 mx-auto">
              <div className="w-16 h-16 border-4 border-zinc-600 border-t-accent rounded-full animate-spin"></div>
            </div>
            <p className="text-zinc-400">Video preview will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
