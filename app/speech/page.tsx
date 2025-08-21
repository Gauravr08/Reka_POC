'use client';
import { FileAudio, RotateCcw, MicIcon, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const speechFeatures = [
  {
    icon: FileAudio,
    title: 'Transcription',
    description: 'Try your own audio or a sample voicemail with mumbling. Convert speech to accurate text.',
    href: '/speech/transcription',
    color: 'from-blue-500 to-cyan-400'
  },
  {
    icon: RotateCcw,
    title: 'Translation',
    description: 'Try your own clip or a fast-paced English news segment. Translate speech across languages.',
    href: '/speech/translation',
    color: 'from-green-500 to-emerald-400'
  },
  {
    icon: MicIcon,
    title: 'Speech-to-Speech',
    description: 'Try your own recording or a sample tour guide audio in Japanese. Convert speech to different voices.',
    href: '/speech/speech-to-speech',
    color: 'from-purple-500 to-violet-400'
  }
];

export default function SpeechPage() {
  return (
    <div className="p-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Reka Speech</h1>
        <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
          AI-powered speech tools that transcribe, translate, and speak across languages — even in real-world, noisy conditions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {speechFeatures.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <Link
              key={feature.href}
              href={feature.href}
              className="group relative overflow-hidden rounded-xl bg-surface border border-zinc-800 p-8 hover:border-accent/50 transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} mb-6`}>
                <IconComponent size={24} className="text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-accent transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-zinc-400 mb-6 leading-relaxed">
                {feature.description}
              </p>

              {/* Arrow */}
              <div className="flex items-center text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium mr-2">Get Started</span>
                <ArrowRight size={16} />
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </Link>
          );
        })}
      </div>

      {/* Additional Info Section */}
      <div className="mt-16 text-center">
        <div className="bg-surface/30 border border-zinc-800 rounded-xl p-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-white mb-4">Advanced Speech Processing</h3>
          <p className="text-zinc-400 mb-6">
            Our AI-powered speech tools work reliably even in challenging audio conditions with background noise, multiple speakers, and various accents.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm text-zinc-300">High accuracy transcription</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🌍</div>
              <div className="text-sm text-zinc-300">Multi-language support</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🔊</div>
              <div className="text-sm text-zinc-300">Noise-resistant processing</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
