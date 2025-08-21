import { NextRequest } from 'next/server';
import { openAI, openRouter, defaultProvider } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { question, imageUrl, context = '' } = await req.json();
    
    if (!question || !imageUrl) {
      return new Response('Question and image URL are required', { status: 400 });
    }

    const provider = defaultProvider === 'openrouter' ? openRouter : openAI;
    
    if (!provider.key) {
      return new Response(`Missing ${defaultProvider.toUpperCase()}_API_KEY`, { status: 400 });
    }

    const messages: any[] = [
      {
        role: 'system',
        content: 'You are an expert visual analyst. Answer questions about images with detailed, accurate, and insightful responses. Consider visual elements, composition, context, and any relevant details that help answer the question comprehensively.'
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Question: ${question}

${context ? `Additional context: ${context}` : ''}

Please provide a detailed answer based on what you can observe in the image. Include:
1. Direct answer to the question
2. Visual evidence supporting your answer
3. Relevant details you notice
4. Any limitations or uncertainties in your analysis`
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl }
          }
        ]
      }
    ];

    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${provider.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: provider.chatModel,
        messages,
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(error, { status: response.status });
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({
      answer: data.choices[0].message.content,
      metadata: {
        question,
        hasContext: !!context,
        timestamp: new Date().toISOString(),
        model: provider.chatModel
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Visual Q&A error:', error);
    return new Response(error.message, { status: 500 });
  }
}
