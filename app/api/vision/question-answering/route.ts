import { NextRequest } from 'next/server';
import { openAI, openRouter, defaultProvider } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    let question = '';
    let imageUrl = '';
    let context = '';

    // Handle both FormData (file uploads) and JSON requests
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await req.formData();
      question = formData.get('question') as string || '';
      context = formData.get('context') as string || '';
      
      const file = formData.get('file') as File;
      if (file) {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          return new Response('File size too large. Maximum size is 10MB.', { status: 400 });
        }
        
        // Convert file to base64 using FileReader approach for better compatibility
        try {
          const bytes = await file.arrayBuffer();
          const uint8Array = new Uint8Array(bytes);
          
          // Use a more efficient base64 conversion
          let binary = '';
          for (let i = 0; i < uint8Array.byteLength; i++) {
            binary += String.fromCharCode(uint8Array[i]);
          }
          const base64 = btoa(binary);
          
          imageUrl = `data:${file.type};base64,${base64}`;
        } catch (conversionError) {
          console.error('File conversion error:', conversionError);
          return new Response('Failed to process the uploaded file.', { status: 400 });
        }
      }
    } else {
      // Handle JSON request
      try {
        const body = await req.json();
        question = body.question || '';
        imageUrl = body.imageUrl || '';
        context = body.context || '';
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return new Response('Invalid JSON in request body', { status: 400 });
      }
    }
    
    if (!question) {
      return new Response('Question is required', { status: 400 });
    }

    // If no image provided, return a text-only response
    if (!imageUrl) {
      return new Response(JSON.stringify({
        answer: "I'd be happy to help answer questions about images! Please upload an image file and ask your question about it. I can analyze visual content, identify objects, read text, understand scenes, and provide detailed insights about what I see.",
        metadata: {
          question,
          hasImage: false,
          timestamp: new Date().toISOString()
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
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
