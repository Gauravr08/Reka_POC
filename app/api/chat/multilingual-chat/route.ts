import { NextRequest } from 'next/server';
import { openAI, openRouter, defaultProvider } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages, targetLanguage = 'auto', sourceLanguage = 'auto', translationMode = false } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages array is required', { status: 400 });
    }

    const provider = defaultProvider === 'openrouter' ? openRouter : openAI;
    
    if (!provider.key) {
      return new Response(`Missing ${defaultProvider.toUpperCase()}_API_KEY`, { status: 400 });
    }

    // Prepare system message for multilingual capabilities
    const systemMessage = {
      role: 'system',
      content: `You are a multilingual AI assistant with advanced language capabilities. You can:

1. **Conversation**: Chat naturally in multiple languages
2. **Translation**: Translate text between languages accurately
3. **Language Detection**: Identify the language of input text
4. **Cultural Context**: Provide culturally appropriate responses
5. **Language Learning**: Help users learn new languages
6. **Code-Switching**: Handle mixed-language conversations

Configuration:
- Target Language: ${targetLanguage}
- Source Language: ${sourceLanguage}
- Translation Mode: ${translationMode ? 'Enabled' : 'Disabled'}

${translationMode ? 
  `Translation Mode Instructions:
  - Translate user messages to ${targetLanguage}
  - Provide your response in ${targetLanguage}
  - Include original text when helpful for clarity
  - Explain cultural nuances when relevant` :
  `Conversation Mode Instructions:
  - Respond in the same language as the user unless they specify otherwise
  - If user switches languages, adapt accordingly
  - Help with language-related questions
  - Maintain natural conversation flow`
}

Be helpful, accurate, and culturally sensitive in your responses.`
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
        temperature: 0.7,
        max_tokens: 2000,
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
    console.error('Multilingual chat error:', error);
    return new Response(error.message, { status: 500 });
  }
}
