import { NextRequest } from 'next/server';
import { openAI, openRouter, defaultProvider, exa } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    let query = '';
    let imageUrl = '';
    let searchType = 'visual';
    let filters = {};

    // Handle both FormData (file uploads) and JSON requests
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await req.formData();
      query = formData.get('query') as string || '';
      searchType = formData.get('searchType') as string || 'visual';
      
      const file = formData.get('file') as File;
      if (file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/mov'];
        if (!validTypes.includes(file.type)) {
          return new Response('Invalid file type. Please upload an image (JPEG, PNG, WebP) or video (MP4, WebM, MOV).', { status: 400 });
        }
        
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          return new Response('File size too large. Maximum size is 10MB.', { status: 400 });
        }
        
        console.log(`Processing file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
        
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
          console.log(`Successfully converted file to base64, length: ${base64.length}`);
        } catch (conversionError) {
          console.error('File conversion error:', conversionError);
          return new Response('Failed to process the uploaded file.', { status: 400 });
        }
      }
    } else {
      // Handle JSON request
      try {
        const body = await req.json();
        query = body.query || '';
        imageUrl = body.imageUrl || '';
        searchType = body.searchType || 'visual';
        filters = body.filters || {};
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return new Response('Invalid JSON in request body', { status: 400 });
      }
    }
    
    if (!query && !imageUrl) {
      return new Response('Either a search query or an image file is required', { status: 400 });
    }

    console.log(`Archive search request - Query: "${query}", Has image: ${!!imageUrl}, Search type: ${searchType}`);

    const provider = defaultProvider === 'openrouter' ? openRouter : openAI;
    
    if (!provider.key) {
      return new Response(`Missing ${defaultProvider.toUpperCase()}_API_KEY`, { status: 400 });
    }

    let searchResults = null;

    // If we have EXA API, use it for enhanced search
    if (exa.key && query) {
      try {
        const exaResponse = await fetch(`${exa.baseUrl}/search`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${exa.key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `visual archive ${query}`,
            type: 'neural',
            useAutoprompt: true,
            numResults: 10,
            contents: {
              text: true,
              highlights: true,
              summary: true
            }
          }),
        });

        if (exaResponse.ok) {
          searchResults = await exaResponse.json();
        }
      } catch (exaError) {
        console.warn('EXA search failed, falling back to LLM analysis');
      }
    }

    // Prepare the analysis prompt
    const messages: any[] = [
      {
        role: 'system',
        content: 'You are a visual archive specialist. Help users find and analyze visual content from archives, databases, and collections. Provide detailed insights about visual elements, historical context, and search strategies.'
      }
    ];

    if (imageUrl) {
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this image for archive search purposes. Query: "${query}". Search type: ${searchType}. 

Please provide:
1. Visual elements description
2. Historical/contextual analysis
3. Similar archive search terms
4. Metadata suggestions
5. Related collections to explore
6. Technical details (style, period, technique)

${searchResults ? `Additional context from web search: ${JSON.stringify(searchResults.results?.slice(0, 3))}` : ''}`
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl }
          }
        ]
      });
    } else {
      messages.push({
        role: 'user',
        content: `Help me search visual archives for: "${query}"

Search type: ${searchType}
Filters: ${JSON.stringify(filters)}

Please provide:
1. Optimized search strategies
2. Relevant archive databases
3. Alternative search terms
4. Visual characteristics to look for
5. Historical context
6. Collection recommendations

${searchResults ? `Web search context: ${JSON.stringify(searchResults.results?.slice(0, 3))}` : ''}`
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
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(error, { status: response.status });
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({
      analysis: data.choices[0].message.content,
      webResults: searchResults?.results || null,
      metadata: {
        searchType,
        filters,
        hasImage: !!imageUrl,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Archive search error:', error);
    return new Response(error.message, { status: 500 });
  }
}
