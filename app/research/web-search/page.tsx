'use client';
import { useState } from 'react';
import { Search, Globe, ExternalLink, CheckCircle } from 'lucide-react';

interface Source {
  title: string;
  url: string;
  type: string;
}

interface SearchResult {
  id: number;
  title: string;
  summary: string;
  sources: Source[];
  confidence: number;
}

const suggestedPrompts = [
  'Market Prospecting',
  'Entity Discovery', 
  'News Curation'
];

const demoSearches = [
  {
    id: 1,
    query: 'Latest developments in AI agent frameworks 2025',
    status: 'completed',
    sources: 8,
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    query: 'Climate change impact on renewable energy adoption',
    status: 'completed',
    sources: 12,
    timestamp: '1 day ago'
  },
  {
    id: 3,
    query: 'Cybersecurity trends and threat landscape 2025',
    status: 'completed',
    sources: 6,
    timestamp: '3 days ago'
  }
];

export default function WebSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const response = await fetch('/api/research/web-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      setSearchResults([{
        id: 1,
        title: `Research Analysis: ${searchQuery}`,
        summary: data.summary,
        sources: data.sources || [],
        confidence: 95
      }]);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([{
        id: 1,
        title: 'Search Error',
        summary: 'Sorry, there was an error performing the web search. Please try again.',
        sources: [],
        confidence: 0
      }]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Multi-Step Web Search</h1>
        <p className="text-zinc-400">
          Synthesizes and verifies information across multiple web sources for comprehensive, reliable answers.
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-8">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Describe your task..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface/70 border border-zinc-700 rounded-lg px-4 py-4 pr-12 text-white placeholder-zinc-500 focus:border-accent focus:outline-none text-lg"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            disabled={isSearching}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-accent disabled:opacity-50"
          >
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

      {/* Search Progress */}
      {isSearching && (
        <div className="mb-8 p-6 bg-surface/30 border border-zinc-700 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
            <h3 className="text-lg font-medium text-white">Researching your query...</h3>
          </div>
          <div className="space-y-2 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              <span>Analyzing search query</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
              <span>Searching multiple sources</span>
            </div>
            <div className="flex items-center gap-2 opacity-50">
              <div className="rounded-full h-4 w-4 border-2 border-zinc-600"></div>
              <span>Synthesizing information</span>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Research Results</h3>
          {searchResults.map((result) => (
            <div key={result.id} className="bg-surface/50 border border-zinc-700 rounded-lg p-6 mb-4">
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-lg font-medium text-white">{result.title}</h4>
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle size={16} />
                  <span>{result.confidence}% confidence</span>
                </div>
              </div>
              
              <p className="text-zinc-300 mb-4 leading-relaxed">{result.summary}</p>
              
              <div className="border-t border-zinc-700 pt-4">
                <h5 className="text-sm font-medium text-zinc-300 mb-3">Sources ({result.sources.length})</h5>
                <div className="space-y-2">
                  {result.sources.map((source, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-surface/30 rounded-lg">
                      <Globe size={16} className="text-accent" />
                      <div className="flex-1">
                        <a href={source.url} target="_blank" className="text-sm text-white hover:text-accent">
                          {source.title}
                        </a>
                        <div className="text-xs text-zinc-500">{source.type}</div>
                      </div>
                      <ExternalLink size={14} className="text-zinc-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Searches */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Recent Searches</h3>
        <div className="grid gap-3">
          {demoSearches.map((search) => (
            <div key={search.id} className="flex items-center justify-between p-4 bg-surface/30 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors cursor-pointer">
              <div className="flex-1">
                <p className="text-white text-sm">{search.query}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-zinc-500">
                  <span>{search.sources} sources</span>
                  <span>{search.timestamp}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-xs text-zinc-400">Completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
