'use client';
import { Globe, FileText, Lightbulb, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const researchFeatures = [
  {
    icon: Globe,
    title: 'Multi-Step Web Search',
    description: 'Synthesizes and verifies information across multiple web sources for comprehensive, reliable answers',
    href: '/research/web-search',
    color: 'from-blue-500 to-cyan-400'
  },
  {
    icon: FileText,
    title: 'Private Document Based Research',
    description: 'Searches and cites your internal documents to deliver context-aware, secure insights',
    href: '/research/document-research',
    color: 'from-green-500 to-emerald-400'
  },
  {
    icon: Lightbulb,
    title: 'Domain Specialized Research',
    description: 'Builds custom research agents tailored to specific industries or knowledge domains',
    href: '/research/domain-research',
    color: 'from-purple-500 to-violet-400'
  }
];

export default function ResearchPage() {
  return (
    <div className="p-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Reka Research</h1>
        <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
          Ask a research question. Get structured, verifiable insights — in one step.
        </p>
        <p className="text-zinc-500 mt-2">
          Supports complex, multi-step research across files and the web.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {researchFeatures.map((feature) => {
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
          <h3 className="text-xl font-semibold text-white mb-4">Try Your Own Prompt</h3>
          <p className="text-zinc-400 mb-6">
            Start with one of our specialized research tools, or create your own custom research workflow.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🔍</div>
              <div className="text-sm text-zinc-300">Multi-source verification</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm text-zinc-300">Structured insights</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-sm text-zinc-300">Private & secure</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
