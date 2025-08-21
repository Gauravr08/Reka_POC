'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';

const suggestedPrompts = [
  'Text in Video',
  'Audio in Video', 
  'Man Walking',
  'Burning Fire'
];

const demoVideos = [
  {
    id: 1,
    title: 'People Walking | Jogging | Beach...',
    duration: '13:24',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop'
  },
  {
    id: 2,
    title: 'What Is NATO? All You Need to...',
    duration: '07:56',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop'
  },
  {
    id: 3,
    title: 'Sahara Desert & Dubai Desert |...',
    duration: '03:40',
    thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=300&h=200&fit=crop'
  },
  {
    id: 4,
    title: 'Education | School | Library |...',
    duration: '09:42',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop'
  },
  {
    id: 5,
    title: 'Leading by Example: National...',
    duration: '01:19',
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop'
  },
  {
    id: 6,
    title: '#089: Building a culture of...',
    duration: '18:47',
    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&h=200&fit=crop'
  },
  {
    id: 7,
    title: 'Pizza Portal | Fat Health | Junk...',
    duration: '',
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop'
  },
  {
    id: 8,
    title: 'Wildlife African Safari |...',
    duration: '',
    thumbnail: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=300&h=200&fit=crop'
  },
  {
    id: 9,
    title: 'How Early Should We....',
    duration: '',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop'
  }
];

export default function ArchiveSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'demo' | 'your'>('demo');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Archive Search</h1>
        <p className="text-zinc-400">
          Find scenes by describing emotions, dialogue, or actions.
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-8">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="What are you looking for?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface/70 border border-zinc-700 rounded-lg px-4 py-4 pr-12 text-white placeholder-zinc-500 focus:border-accent focus:outline-none text-lg"
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-accent">
            <Search size={20} />
          </button>
        </div>

        {/* Suggested Prompts */}
        <div className="mb-6">
          <p className="text-sm text-zinc-400 mb-3">Suggested Prompts:</p>
          <div className="flex gap-3 flex-wrap">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setSearchQuery(prompt)}
                className="px-4 py-2 bg-surface border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:border-accent hover:text-accent transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-1 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('demo')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'demo'
                ? 'border-accent text-accent'
                : 'border-transparent text-zinc-400 hover:text-zinc-300'
            }`}
          >
            Demo videos
          </button>
          <button
            onClick={() => setActiveTab('your')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'your'
                ? 'border-accent text-accent'
                : 'border-transparent text-zinc-400 hover:text-zinc-300'
            }`}
          >
            Your videos
          </button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoVideos.map((video) => (
          <div
            key={video.id}
            className="group cursor-pointer"
          >
            <div className="relative mb-3 rounded-lg overflow-hidden bg-zinc-800">
              <div className="aspect-video bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
                <div className="text-zinc-500 text-6xl">▶</div>
              </div>
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              )}
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                DEMO
              </div>
            </div>
            <h3 className="text-sm text-white group-hover:text-accent transition-colors line-clamp-2">
              {video.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
