import { NextRequest } from 'next/server';
import { openAI, openRouter, defaultProvider } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages, imageUrl, analysisType = 'comprehensive' } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages array is required', { status: 400 });
    }

    const provider = defaultProvider === 'openrouter' ? openRouter : openAI;
    
    if (!provider.key) {
      return new Response(`Missing ${defaultProvider.toUpperCase()}_API_KEY`, { status: 400 });
    }

    // Prepare messages for multimodal conversation
    const conversationMessages: any[] = [
      {
        role: 'system',
        content: `You are an expert image analysis assistant. You can analyze images and discuss them in detail. 
        
Analysis type: ${analysisType}
        
Provide detailed, accurate, and insightful responses about visual content. Consider composition, colors, objects, people, text, context, and any other relevant visual elements.`
      }
    ];

    // Add conversation history
    messages.forEach((msg: any) => {
      if (msg.role === 'user' && imageUrl && msg.includeImage) {
        conversationMessages.push({
          role: 'user',
          content: [
            {
              type: 'text',
              text: msg.content
            },
            {
              type: 'image_url',
              image_url: { url: imageUrl }
            }
          ]
        });
      } else {
        conversationMessages.push({
          role: msg.role,
          content: msg.content
        });
      }
    });

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
    console.error('Image analysis chat error:', error);
    return new Response(error.message, { status: 500 });
  }
}
