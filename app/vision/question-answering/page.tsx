'use client';
import { useState } from 'react';
import { Send } from 'lucide-react';

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

  const handleSendQuestion = async () => {
    if (!question.trim()) return;
    
    const userMessage = { id: Date.now(), type: 'user' as const, content: question };
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'assistant' as const,
        content: `Based on the video content analysis, here's what I found regarding your question: "${userMessage.content}"\n\nThis is a simulated response. In a real implementation, this would connect to your AI model to analyze the video content and provide accurate answers based on the visual and audio information extracted from the selected video.`
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
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
          Ask questions about your video content and get AI-powered answers.
        </p>
      </div>

      {/* Video Selection Section */}
      <div className="mb-6 p-4 bg-surface/50 border border-zinc-700 rounded-lg">
        <h3 className="text-sm font-medium text-zinc-300 mb-2">Selected Video:</h3>
        <div className="flex items-center gap-3">
          <div className="w-20 h-12 bg-zinc-800 rounded flex items-center justify-center">
            <div className="text-zinc-500 text-xl">▶</div>
          </div>
          <div>
            <p className="text-sm text-white">No video selected</p>
            <p className="text-xs text-zinc-500">Please select a video from Archive Search to begin asking questions</p>
          </div>
        </div>
      </div>

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
