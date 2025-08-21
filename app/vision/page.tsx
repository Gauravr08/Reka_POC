'use client';
import { Video, Search, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const visionFeatures = [
  {
    name: 'Reel Generation',
    description: 'Effortlessly turn videos into intelligent, meaningful content.',
    icon: Video,
    path: '/vision/reel-generation'
  },
  {
    name: 'Archive Search',
    description: 'Find scenes by describing emotions, dialogue, or actions.',
    icon: Search,
    path: '/vision/archive-search'
  },
  {
    name: 'Question Answering',
    description: 'Ask questions and get summaries from news, shows, or podcasts.',
    icon: HelpCircle,
    path: '/vision/question-answering'
  }
];

export default function VisionPage() {
  const router = useRouter();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-accent mb-4">Vision</h1>
        <p className="text-zinc-400 max-w-3xl">
          Accurate, fast, agentic video AI for searching and question answering over millions of videos and images.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Interactions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visionFeatures.map((feature) => (
            <div
              key={feature.name}
              onClick={() => router.push(feature.path)}
              className="bg-surface rounded-2xl border border-zinc-800 p-6 hover:border-accent hover:shadow-glow transition-all duration-300 group cursor-pointer"
            >
              <feature.icon className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-lg font-bold text-white mb-2">{feature.name}</h3>
              <p className="text-sm text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
