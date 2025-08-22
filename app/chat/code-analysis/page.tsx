'use client';
import { useState } from 'react';
import { Send, Code as CodeIcon, Upload, Copy, Check } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  code?: {
    language: string;
    content: string;
  };
}

const programmingLanguages = [
  'JavaScript', 'Python', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'
];

const codeExamples = [
  {
    language: 'Python',
    title: 'List Comprehension',
    code: `# Generate squares of even numbers
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_squares = [x**2 for x in numbers if x % 2 == 0]
print(even_squares)  # Output: [4, 16, 36, 64, 100]`
  },
  {
    language: 'JavaScript',
    title: 'Async/Await Pattern',
    code: `async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}`
  }
];

export default function CodeAnalysis() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedStates, setCopiedStates] = useState<{[key: number]: boolean}>({});

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !codeInput.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputMessage || 'Please analyze this code',
      code: codeInput.trim() ? {
        language: selectedLanguage,
        content: codeInput
      } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    const currentCode = codeInput;
    setInputMessage('');
    setCodeInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/code-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage || 'Please analyze this code',
          code: currentCode.trim() || null,
          language: selectedLanguage,
          messages: messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content + (msg.code ? `\n\nCode:\n\`\`\`${msg.code.language.toLowerCase()}\n${msg.code.content}\n\`\`\`` : '')
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiContent = '';
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        type: 'assistant',
        content: ''
      };
      
      setMessages(prev => [...prev, aiMessage]);

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          aiContent += chunk;
          
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessage.id 
                ? { ...msg, content: aiContent }
                : msg
            )
          );
        }
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'I apologize, but I encountered an error while analyzing your code. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCodeAnalysis = (code: {language: string, content: string}) => {
    return `## Code Analysis Results\n\n**Language:** ${code.language}\n\n**Analysis:**\n\n✅ **Strengths:**\n• Clean and readable code structure\n• Proper error handling implemented\n• Good variable naming conventions\n\n🔧 **Suggestions:**\n• Consider adding input validation\n• Could benefit from additional comments\n• Performance could be optimized in specific areas\n\n📝 **Overall Assessment:**\nThis is well-structured ${code.language} code that follows good practices. The logic is clear and the implementation is solid with room for minor improvements.`;
  };

  const handleCopyCode = (messageId: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedStates(prev => ({ ...prev, [messageId]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [messageId]: false }));
    }, 2000);
  };

  const loadExample = (example: typeof codeExamples[0]) => {
    setCodeInput(example.code);
    setSelectedLanguage(example.language);
    setInputMessage(`Analyze this ${example.title} example`);
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Code Analysis</h1>
        <p className="text-zinc-400">
          Analyze, debug, and explain code snippets across multiple programming languages.
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 mb-6 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="inline-flex p-4 rounded-full bg-accent/10 border border-accent/20">
                <CodeIcon size={32} className="text-accent" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Ready to Analyze Code</h3>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Paste your code snippet and I'll help you with debugging, optimization, and best practices.
            </p>

            {/* Code Examples */}
            <div className="max-w-4xl mx-auto mb-8">
              <h4 className="text-lg font-medium text-white mb-4">Try These Examples:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {codeExamples.map((example, index) => (
                  <div key={index} className="p-4 bg-surface/30 border border-zinc-700 rounded-lg text-left">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-medium text-white">{example.title}</h5>
                        <p className="text-sm text-accent">{example.language}</p>
                      </div>
                      <button
                        onClick={() => loadExample(example)}
                        className="px-3 py-1 text-sm bg-accent text-black rounded hover:bg-accent/80 transition-colors"
                      >
                        Load Example
                      </button>
                    </div>
                    <pre className="text-xs text-zinc-400 bg-black/20 rounded p-3 overflow-x-auto">
                      {example.code.split('\n').slice(0, 3).join('\n')}
                      {example.code.split('\n').length > 3 && '\n...'}
                    </pre>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="p-4 bg-surface/30 border border-zinc-700 rounded-lg">
                <h4 className="font-medium text-white mb-2">🐛 Debug Code</h4>
                <p className="text-sm text-zinc-400">Find and fix bugs in your code</p>
              </div>
              <div className="p-4 bg-surface/30 border border-zinc-700 rounded-lg">
                <h4 className="font-medium text-white mb-2">⚡ Optimize Performance</h4>
                <p className="text-sm text-zinc-400">Improve code efficiency</p>
              </div>
              <div className="p-4 bg-surface/30 border border-zinc-700 rounded-lg">
                <h4 className="font-medium text-white mb-2">📚 Best Practices</h4>
                <p className="text-sm text-zinc-400">Learn coding standards</p>
              </div>
              <div className="p-4 bg-surface/30 border border-zinc-700 rounded-lg">
                <h4 className="font-medium text-white mb-2">📝 Documentation</h4>
                <p className="text-sm text-zinc-400">Generate code comments</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-4xl p-4 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-accent text-black'
                      : 'bg-surface border border-zinc-700 text-white'
                  }`}
                >
                  {message.code && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium opacity-80">
                          {message.code.language}
                        </span>
                        <button
                          onClick={() => handleCopyCode(message.id, message.code!.content)}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-black/20 rounded hover:bg-black/30 transition-colors"
                        >
                          {copiedStates[message.id] ? (
                            <>
                              <Check size={12} />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="bg-black/20 rounded p-3 overflow-x-auto text-sm">
                        <code>{message.code.content}</code>
                      </pre>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
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
                    <span className="text-zinc-400 text-sm">Analyzing code...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Code Input Section */}
      {codeInput && (
        <div className="mb-4 p-4 bg-surface/50 border border-zinc-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-surface border border-zinc-600 rounded px-3 py-1 text-white text-sm"
            >
              {programmingLanguages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <button
              onClick={() => setCodeInput('')}
              className="text-zinc-400 hover:text-white text-sm"
            >
              Clear Code
            </button>
          </div>
          <pre className="bg-black/20 rounded p-3 text-sm text-zinc-300 max-h-32 overflow-y-auto">
            <code>{codeInput}</code>
          </pre>
        </div>
      )}

      {/* Input Area */}
      <div className="space-y-3">
        <textarea
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          placeholder="Paste your code here..."
          className="w-full bg-surface/70 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:border-accent focus:outline-none resize-none font-mono text-sm"
          rows={4}
        />
        <div className="flex gap-3">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-surface border border-zinc-700 rounded-lg px-3 py-3 text-white"
          >
            {programmingLanguages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="What would you like me to analyze about this code?"
              disabled={isLoading}
              className="w-full bg-surface/70 border border-zinc-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-zinc-500 focus:border-accent focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              disabled={(!inputMessage.trim() && !codeInput.trim()) || isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-accent text-black rounded-lg hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
