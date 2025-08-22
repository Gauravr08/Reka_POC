'use client';
import { useState } from 'react';
import { Search, Loader2, Image as ImageIcon } from 'lucide-react';

const suggestedPrompts = [
  'Text in Video',
  'Audio in Video', 
  'Man Walking',
  'Burning Fire'
];

export default function ArchiveSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'demo' | 'your'>('demo');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim() && !selectedFile) {
      setError('Please enter a search query or upload an image');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('query', searchQuery);
      formData.append('searchType', 'visual');
      
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const response = await fetch('/api/vision/archive-search', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to search archives');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImageUrl('');
  };

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
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-surface/70 border border-zinc-700 rounded-lg px-4 py-4 pr-12 text-white placeholder-zinc-500 focus:border-accent focus:outline-none text-lg"
              />
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-accent disabled:opacity-50"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
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

          {/* Image Upload */}
          <div className="bg-surface/50 border border-zinc-700 rounded-lg p-6">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <ImageIcon size={20} />
              Search by Image
            </h3>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-accent file:text-black hover:file:bg-accent/80"
              />
              {imageUrl && (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Search reference"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Results */}
      {results ? (
        <div className="space-y-6">
          {results.analysis && (
            <div className="bg-surface/50 border border-accent/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-accent mb-4">AI Analysis</h3>
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-zinc-300">
                  {results.analysis}
                </div>
              </div>
            </div>
          )}

          {results.webResults && results.webResults.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Search Results</h3>
              <div className="grid gap-4">
                {results.webResults.map((result: any, index: number) => (
                  <div key={index} className="bg-surface/50 border border-zinc-700 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-2">
                      <a 
                        href={result.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-accent hover:text-accent/80"
                      >
                        {result.title}
                      </a>
                    </h4>
                    <p className="text-zinc-400 text-sm mb-2">{result.url}</p>
                    {result.summary && (
                      <p className="text-zinc-300">{result.summary}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setResults(null);
              setSearchQuery('');
              setImageUrl('');
            }}
            className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
          >
            New Search
          </button>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Search className="w-12 h-12 text-zinc-600" />
          </div>
          <p className="text-zinc-400">Enter a search query to find content in archives</p>
          <p className="text-zinc-500 text-sm mt-2">You can search by text description or upload an image</p>
        </div>
      )}
    </div>
  );
}
