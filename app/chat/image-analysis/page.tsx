'use client';
import { useState, useRef } from 'react';
import { Send, Upload, Image as ImageIcon, X } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  image?: string;
}

export default function ImageAnalysis() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !uploadedImage) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputMessage || 'Analyze this image',
      image: uploadedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    const currentImage = uploadedImage;
    setInputMessage('');
    setUploadedImage(null);
    setIsLoading(true);

    try {
      if (currentImage) {
        // Convert data URL to blob
        const response = await fetch(currentImage);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append('image', blob, 'image.jpg');
        formData.append('message', currentMessage || 'Analyze this image in detail');

        const apiResponse = await fetch('/api/chat/image-analysis', {
          method: 'POST',
          body: formData,
        });

        if (!apiResponse.ok) {
          throw new Error(`Error: ${apiResponse.status} ${apiResponse.statusText}`);
        }

        const data = await apiResponse.json();
        
        const aiResponse: Message = {
          id: Date.now() + 1,
          type: 'assistant',
          content: data.analysis
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        // Text-only message
        const apiResponse = await fetch('/api/chat/image-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: currentMessage }),
        });

        if (!apiResponse.ok) {
          throw new Error(`Error: ${apiResponse.status} ${apiResponse.statusText}`);
        }

        const data = await apiResponse.json();
        
        const aiResponse: Message = {
          id: Date.now() + 1,
          type: 'assistant',
          content: data.analysis || data.response
        };
        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'I apologize, but I encountered an error while analyzing the content. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateImageAnalysis = () => {
    const analyses = [
      'a landscape photograph with rich natural colors and composition',
      'a portrait with good lighting and facial expression details',
      'an architectural structure with interesting geometric patterns',
      'a product photo with clear details and professional styling',
      'artwork with vibrant colors and creative composition'
    ];
    return analyses[Math.floor(Math.random() * analyses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Image Analysis</h1>
        <p className="text-zinc-400">
          Analyze and describe image content and context with advanced computer vision capabilities.
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 mb-6 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="inline-flex p-4 rounded-full bg-accent/10 border border-accent/20">
                <ImageIcon size={32} className="text-accent" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Ready to Analyze Images</h3>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Upload an image and ask questions about it, or describe what you'd like me to analyze.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-surface/30 border border-zinc-700 rounded-lg">
                <h4 className="font-medium text-white mb-2">🔍 Object Detection</h4>
                <p className="text-sm text-zinc-400">Identify and locate objects in images</p>
              </div>
              <div className="p-4 bg-surface/30 border border-zinc-700 rounded-lg">
                <h4 className="font-medium text-white mb-2">📝 Text Recognition</h4>
                <p className="text-sm text-zinc-400">Extract and read text from images</p>
              </div>
              <div className="p-4 bg-surface/30 border border-zinc-700 rounded-lg">
                <h4 className="font-medium text-white mb-2">🎨 Scene Understanding</h4>
                <p className="text-sm text-zinc-400">Analyze composition and context</p>
              </div>
              <div className="p-4 bg-surface/30 border border-zinc-700 rounded-lg">
                <h4 className="font-medium text-white mb-2">💡 Content Insights</h4>
                <p className="text-sm text-zinc-400">Get detailed descriptions and analysis</p>
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
                  className={`max-w-2xl p-4 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-accent text-black'
                      : 'bg-surface border border-zinc-700 text-white'
                  }`}
                >
                  {message.image && (
                    <div className="mb-3">
                      <img
                        src={message.image}
                        alt="Uploaded"
                        className="max-w-sm max-h-48 rounded-lg object-cover"
                      />
                    </div>
                  )}
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
                    <span className="text-zinc-400 text-sm">Analyzing image...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Upload Preview */}
      {uploadedImage && (
        <div className="mb-4 p-3 bg-surface/50 border border-zinc-700 rounded-lg">
          <div className="flex items-center gap-3">
            <img
              src={uploadedImage}
              alt="Preview"
              className="w-16 h-16 rounded object-cover"
            />
            <div className="flex-1">
              <p className="text-sm text-white">Image ready for analysis</p>
              <p className="text-xs text-zinc-500">Click send to analyze this image</p>
            </div>
            <button
              onClick={() => setUploadedImage(null)}
              className="p-1 text-zinc-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 bg-surface border border-zinc-700 rounded-lg hover:border-accent transition-colors"
        >
          <Upload size={20} className="text-zinc-400" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <div className="flex-1 relative">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Describe what you'd like me to analyze about the image..."
            disabled={isLoading}
            className="w-full bg-surface/70 border border-zinc-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-zinc-500 focus:border-accent focus:outline-none resize-none"
            rows={2}
          />
          <button
            onClick={handleSendMessage}
            disabled={(!inputMessage.trim() && !uploadedImage) || isLoading}
            className="absolute bottom-3 right-3 p-2 bg-accent text-black rounded-lg hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
