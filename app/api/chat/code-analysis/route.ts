import { NextRequest } from 'next/server';
import { openAI, openRouter, defaultProvider } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages, codeContext, language = 'auto-detect' } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages array is required', { status: 400 });
    }

    const provider = defaultProvider === 'openrouter' ? openRouter : openAI;
    
    if (!provider.key) {
      return new Response(`Missing ${defaultProvider.toUpperCase()}_API_KEY`, { status: 400 });
    }

    // Prepare system message with code analysis capabilities
    const systemMessage = {
      role: 'system',
      content: `You are an expert code analysis assistant. You can:

1. **Code Review**: Analyze code quality, best practices, and potential issues
2. **Bug Detection**: Identify bugs, security vulnerabilities, and performance issues
3. **Code Explanation**: Explain how code works in plain language
4. **Optimization**: Suggest improvements and optimizations
5. **Documentation**: Help with code documentation and comments
6. **Refactoring**: Suggest better code structure and patterns
7. **Testing**: Help with unit tests and testing strategies

Programming Language: ${language}

${codeContext ? `Code Context:
\`\`\`
${codeContext}
\`\`\`

Analyze this code and be ready to answer questions about it.` : ''}

Provide detailed, accurate, and actionable advice. Include code examples when helpful.`
    };

    const conversationMessages = [systemMessage, ...messages];

    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${provider.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: provider.chatModel,
        messages: conversationMessages,
        temperature: 0.3,
        max_tokens: 3000,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(error, { status: response.status });
    }

    // Return streaming response
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error: any) {
    console.error('Code analysis chat error:', error);
    return new Response(error.message, { status: 500 });
  }
}
