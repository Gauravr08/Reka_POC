import { NextRequest } from 'next/server';
import { openAI, openRouter, defaultProvider } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { prompt, style = 'cinematic', duration = '15s', aspectRatio = '9:16' } = await req.json();
    
    if (!prompt) {
      return new Response('Prompt is required', { status: 400 });
    }

    const provider = defaultProvider === 'openrouter' ? openRouter : openAI;
    
    if (!provider.key) {
      return new Response(`Missing ${defaultProvider.toUpperCase()}_API_KEY`, { status: 400 });
    }

    // Enhanced prompt for reel generation with specific instructions
    const enhancedPrompt = `Create a detailed video reel concept for: "${prompt}"

Style: ${style}
Duration: ${duration}
Aspect Ratio: ${aspectRatio}

Please provide:
1. Shot-by-shot breakdown
2. Visual composition details
3. Transition effects
4. Text overlay suggestions
5. Color palette recommendations
6. Music/audio suggestions
7. Pacing and timing notes

Format the response as a comprehensive reel production guide.`;

    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${provider.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: provider.chatModel,
        messages: [
          {
            role: 'system',
            content: 'You are a professional video production expert specializing in creating engaging short-form content and reels. Provide detailed, actionable production guidance.'
          },
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(error, { status: response.status });
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({
      concept: data.choices[0].message.content,
      metadata: {
        style,
        duration,
        aspectRatio,
        generatedAt: new Date().toISOString()
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Reel generation error:', error);
    return new Response(error.message, { status: 500 });
  }
}
