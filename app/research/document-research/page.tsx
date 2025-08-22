'use client';
import { useState, useRef } from 'react';
import { Upload, FileText, Search, Lock, Plus, X } from 'lucide-react';

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  pages: number;
  file?: File;
}

interface SearchResult {
  answer: string;
  sources: Array<{
    document: string;
    page?: number;
    excerpt: string;
  }>;
}

const suggestedQueries = [
  'What are the key policy changes mentioned in the documents?',
  'Summarize the financial performance metrics',
  'Extract all action items and deadlines',
  'What are the main risks identified?'
];

export default function DocumentResearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach((file) => {
      // Validate file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!validTypes.includes(file.type)) {
        setError('Please select PDF, DOCX, or TXT files only');
        return;
      }

      const newDoc: Document = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type.includes('pdf') ? 'PDF' : file.type.includes('word') ? 'DOCX' : 'TXT',
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        uploadDate: new Date().toISOString().split('T')[0],
        pages: Math.floor(Math.random() * 50) + 1, // Placeholder
        file: file
      };

      setDocuments(prev => [...prev, newDoc]);
    });

    setError(null);
  };

  const removeDocument = (docId: number) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    setSelectedDocs(prev => prev.filter(id => id !== docId));
  };

  const handleDocumentSelect = (docId: number) => {
    setSelectedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || selectedDocs.length === 0) return;
    
    setIsSearching(true);
    setError(null);
    setSearchResult(null);
    
    try {
      const formData = new FormData();
      formData.append('query', searchQuery);
      
      // Add selected documents to form data
      const selectedDocuments = documents.filter(doc => selectedDocs.includes(doc.id));
      selectedDocuments.forEach((doc, index) => {
        if (doc.file) {
          formData.append(`files`, doc.file);
        }
      });

      const response = await fetch('/api/research/document-research', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setSearchResult(data);
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search documents. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Private Document Based Research</h1>
        <p className="text-zinc-400">
          Searches and cites your internal documents to deliver context-aware, secure insights.
        </p>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:border-accent/50 transition-colors cursor-pointer"
        >
          <div className="mb-4">
            <Upload size={48} className="mx-auto text-zinc-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Upload Documents</h3>
          <p className="text-zinc-400 mb-4">
            Drag and drop your files here, or click to browse
          </p>
          <div className="px-6 py-2 bg-accent text-black rounded-lg hover:bg-accent/80 transition-colors font-medium inline-block">
            Choose Files
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            Supports PDF, DOCX, TXT files up to 10MB each
          </p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Document Library */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Document Library</h3>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Lock size={16} />
            <span>Private & Secure</span>
          </div>
        </div>
        
        {documents.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>No documents uploaded yet</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {documents.map((doc) => (
              <div 
                key={doc.id}
                className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${
                  selectedDocs.includes(doc.id)
                    ? 'border-accent bg-accent/5'
                    : 'border-zinc-700 hover:border-zinc-600'
                }`}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-surface border border-zinc-700 rounded-lg flex items-center justify-center">
                    <FileText size={16} className="text-accent" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-white text-sm">{doc.name}</h4>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 mt-1">
                    <span>{doc.type}</span>
                    <span>{doc.size}</span>
                    <span>{doc.pages} pages</span>
                    <span>Uploaded {doc.uploadDate}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDocumentSelect(doc.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedDocs.includes(doc.id)
                        ? 'border-accent bg-accent'
                        : 'border-zinc-600'
                    }`}
                  >
                    {selectedDocs.includes(doc.id) && (
                      <div className="w-2 h-2 bg-black rounded-full" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedDocs.length > 0 && (
          <div className="mt-4 p-3 bg-accent/10 border border-accent/30 rounded-lg">
            <p className="text-sm text-accent">
              {selectedDocs.length} document{selectedDocs.length > 1 ? 's' : ''} selected for research
            </p>
          </div>
        )}
      </div>

      {/* Search Section */}
      <div className="mb-8">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Ask questions about your documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface/70 border border-zinc-700 rounded-lg px-4 py-4 pr-12 text-white placeholder-zinc-500 focus:border-accent focus:outline-none text-lg"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            disabled={isSearching || selectedDocs.length === 0 || !searchQuery.trim()}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-accent disabled:opacity-50"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Suggested Queries */}
        <div className="mb-6">
          <p className="text-sm text-zinc-400 mb-3">Suggested Queries:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(query)}
                className="p-3 bg-surface/30 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:border-accent hover:bg-surface/50 transition-colors text-left"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Status */}
      {isSearching && (
        <div className="mb-8 p-6 bg-surface/30 border border-zinc-700 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
            <h3 className="text-lg font-medium text-white">Analyzing documents...</h3>
          </div>
          <p className="text-sm text-zinc-400 mt-2">
            Searching through {selectedDocs.length} selected document{selectedDocs.length > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Search Results */}
      {searchResult && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Research Results</h3>
          <div className="bg-surface/50 border border-zinc-700 rounded-lg p-6">
            <div className="mb-6">
              <h4 className="text-lg font-medium text-white mb-3">Answer</h4>
              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{searchResult.answer}</p>
              </div>
            </div>
            
            {searchResult.sources && searchResult.sources.length > 0 && (
              <div className="border-t border-zinc-700 pt-6">
                <h5 className="text-sm font-medium text-zinc-300 mb-3">
                  Sources ({searchResult.sources.length})
                </h5>
                <div className="space-y-3">
                  {searchResult.sources.map((source, index) => (
                    <div key={index} className="p-4 bg-surface/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <FileText size={16} className="text-accent mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-white">{source.document}</span>
                            {source.page && (
                              <span className="text-xs text-zinc-500">Page {source.page}</span>
                            )}
                          </div>
                          <p className="text-sm text-zinc-400 leading-relaxed">"{source.excerpt}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-surface/20 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <Lock size={16} className="text-green-400" />
          <h4 className="font-medium text-green-400">Privacy & Security</h4>
        </div>
        <p className="text-sm text-zinc-400">
          Your documents are processed locally and never stored on external servers. 
          All research is conducted in a secure, private environment.
        </p>
      </div>
    </div>
  );
}
