'use client';
import { useState, useRef } from 'react';
import { Send, Upload, X, FileText } from 'lucide-react';

const suggestedPrompts = [
  'What is the main topic of this video?',
  'Summarize the key points discussed',
  'Who are the speakers in this video?',
  'What are the main arguments presented?',
  'Can you extract the quotes from this video?',
  'What is the tone of this conversation?'
];

export default function QuestionAnswering() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{id: number, type: 'user' | 'assistant', content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/mov'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image or video file');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendQuestion = async () => {
    if (!question.trim()) return;
    if (!selectedFile) {
      setError('Please select an image or video file first');
      return;
    }
    
    const userMessage = { id: Date.now(), type: 'user' as const, content: question };
    setMessages(prev => [...prev, userMessage]);
    const currentQuestion = question;
    setQuestion('');
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('question', currentQuestion);

      const response = await fetch('/api/vision/question-answering', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const aiResponse = {
        id: Date.now() + 1,
        type: 'assistant' as const,
        content: data.answer
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant' as const,
        content: `I apologize, but I encountered an error while analyzing your ${selectedFile.type.startsWith('video') ? 'video' : 'image'}. Please try again or check if the file format is supported.`
      };
      setMessages(prev => [...prev, errorMessage]);
      setError('Failed to analyze the file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuestion();
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Question Answering</h1>
        <p className="text-zinc-400">
          Ask questions about your image or video content and get AI-powered answers.
        </p>
      </div>

      {/* File Upload Section */}
      <div className="mb-6 p-4 bg-surface/50 border border-zinc-700 rounded-lg">
        <h3 className="text-sm font-medium text-zinc-300 mb-3">Upload Image or Video:</h3>
        
        {!selectedFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-600 rounded-lg p-8 text-center cursor-pointer hover:border-accent transition-colors"
          >
            <Upload size={40} className="mx-auto mb-4 text-zinc-500" />
            <p className="text-zinc-400 mb-2">Click to upload an image or video</p>
            <p className="text-xs text-zinc-500">Supports: JPG, PNG, WebP, MP4, WebM, MOV</p>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
            <FileText size={24} className="text-accent" />
            <div className="flex-1">
              <p className="text-sm text-white">{selectedFile.name}</p>
              <p className="text-xs text-zinc-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={removeFile}
              className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Suggested Questions */}
      {messages.length === 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-zinc-300 mb-3">Suggested Questions:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setQuestion(prompt)}
                className="p-3 bg-surface/30 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:border-accent hover:bg-surface/50 transition-colors text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 mb-6 overflow-y-auto">
        {messages.length > 0 && (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl p-4 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-accent text-black'
                      : 'bg-surface border border-zinc-700 text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-2xl p-4 rounded-lg bg-surface border border-zinc-700">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-zinc-400 text-sm">AI is analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Question Input */}
      <div className="relative">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask a question about your video content..."
          disabled={isLoading}
          className="w-full bg-surface/70 border border-zinc-700 rounded-lg px-4 py-4 pr-12 text-white placeholder-zinc-500 focus:border-accent focus:outline-none resize-none"
          rows={3}
        />
        <button
          onClick={handleSendQuestion}
          disabled={!question.trim() || isLoading}
          className="absolute bottom-4 right-4 p-2 bg-accent text-black rounded-lg hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
