'use client';
import { Image, Code, Languages, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const chatFeatures = [
  {
    icon: Image,
    title: 'Image Analysis',
    description: 'Analyze and describe image content and context with advanced computer vision capabilities',
    href: '/chat/image-analysis',
    color: 'from-blue-500 to-cyan-400'
  },
  {
    icon: Code,
    title: 'Code Analysis',
    description: 'Analyze, debug, and explain code snippets across multiple programming languages',
    href: '/chat/code-analysis',
    color: 'from-green-500 to-emerald-400'
  },
  {
    icon: Languages,
    title: 'Multilingual Chat',
    description: 'Converse in 50+ languages with accurate translation and cultural context',
    href: '/chat/multilingual-chat',
    color: 'from-purple-500 to-violet-400'
  }
];

export default function ChatPage() {
  return (
    <div className="p-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Reka Chat</h1>
        <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
          Fast, fluent, multimodal AI chat for answering questions and analyzing content, across docs, images, code, and the web.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {chatFeatures.map((feature) => {
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
                <span className="text-sm font-medium mr-2">Start Chatting</span>
                <ArrowRight size={16} />
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </Link>
          );
        })}
      </div>

      {/* New Conversation Section */}
      <div className="mt-16 text-center">
        <div className="bg-surface/30 border border-zinc-800 rounded-xl p-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-white mb-4">Start a New Conversation</h3>
          <p className="text-zinc-400 mb-6">
            Choose from our specialized chat modes or start a general conversation with our advanced AI assistant.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-2xl mb-2">💬</div>
              <div className="text-sm text-zinc-300">Natural conversations</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🧠</div>
              <div className="text-sm text-zinc-300">Intelligent analysis</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🌍</div>
              <div className="text-sm text-zinc-300">Global language support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
