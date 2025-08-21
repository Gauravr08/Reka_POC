'use client';
import { useState } from 'react';
import { Upload, FileText, Search, Lock, Plus } from 'lucide-react';

const uploadedDocuments = [
  {
    id: 1,
    name: 'Company_Policy_2025.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploadDate: '2024-08-18',
    pages: 45
  },
  {
    id: 2,
    name: 'Financial_Report_Q3.docx',
    type: 'DOCX',
    size: '1.8 MB',
    uploadDate: '2024-08-17',
    pages: 23
  },
  {
    id: 3,
    name: 'Research_Notes_AI.txt',
    type: 'TXT',
    size: '0.5 MB',
    uploadDate: '2024-08-16',
    pages: 12
  }
];

const suggestedQueries = [
  'What are the key policy changes mentioned in the documents?',
  'Summarize the financial performance metrics',
  'Extract all action items and deadlines',
  'What are the main risks identified?'
];

export default function DocumentResearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleDocumentSelect = (docId: number) => {
    setSelectedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleSearch = () => {
    if (!searchQuery.trim() || selectedDocs.length === 0) return;
    setIsSearching(true);
    
    // Simulate search
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
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
        <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:border-accent/50 transition-colors">
          <div className="mb-4">
            <Upload size={48} className="mx-auto text-zinc-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Upload Documents</h3>
          <p className="text-zinc-400 mb-4">
            Drag and drop your files here, or click to browse
          </p>
          <button className="px-6 py-2 bg-accent text-black rounded-lg hover:bg-accent/80 transition-colors font-medium">
            Choose Files
          </button>
          <p className="text-xs text-zinc-500 mt-2">
            Supports PDF, DOCX, TXT, MD files up to 10MB each
          </p>
        </div>
      </div>

      {/* Document Library */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Document Library</h3>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Lock size={16} />
            <span>Private & Secure</span>
          </div>
        </div>
        
        <div className="grid gap-3">
          {uploadedDocuments.map((doc) => (
            <div 
              key={doc.id}
              className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedDocs.includes(doc.id)
                  ? 'border-accent bg-accent/5'
                  : 'border-zinc-700 hover:border-zinc-600'
              }`}
              onClick={() => handleDocumentSelect(doc.id)}
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
              
              <div className="flex-shrink-0">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  selectedDocs.includes(doc.id)
                    ? 'border-accent bg-accent'
                    : 'border-zinc-600'
                }`}>
                  {selectedDocs.includes(doc.id) && (
                    <div className="w-2 h-2 bg-black rounded-full" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

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
