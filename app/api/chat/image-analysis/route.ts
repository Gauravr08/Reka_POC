import { NextRequest } from 'next/server';
import { openAI, openRouter, defaultProvider } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    let messages: any[] = [];
    let imageUrl = '';
    let analysisType = 'comprehensive';

    // Handle both FormData (file uploads) and JSON requests
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await req.formData();
      const message = formData.get('message') as string || '';
      
      const file = formData.get('image') as File;
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

      // Create a simple message structure for file uploads
      messages = [
        {
          role: 'user',
          content: message,
          includeImage: !!imageUrl
        }
      ];
    } else {
      // Handle JSON request
      try {
        const body = await req.json();
        messages = body.messages || [];
        imageUrl = body.imageUrl || '';
        analysisType = body.analysisType || 'comprehensive';
        
        // Handle simple message format
        if (body.message && !body.messages) {
          messages = [
            {
              role: 'user',
              content: body.message,
              includeImage: !!imageUrl
            }
          ];
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return new Response('Invalid JSON in request body', { status: 400 });
      }
    }
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('At least one message is required', { status: 400 });
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

    // If no image is provided, return a simple text response
    if (!imageUrl) {
      const simpleResponse = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${provider.key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: provider.chatModel,
          messages: conversationMessages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!simpleResponse.ok) {
        const error = await simpleResponse.text();
        return new Response(error, { status: simpleResponse.status });
      }

      const data = await simpleResponse.json();
      return new Response(JSON.stringify({
        analysis: data.choices[0].message.content,
        metadata: {
          hasImage: false,
          timestamp: new Date().toISOString()
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

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
