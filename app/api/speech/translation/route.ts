import { NextRequest } from 'next/server';
import { openAI, openRouter, defaultProvider } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;
    const targetLanguage = formData.get('target_language') as string || 'english';
    const includeOriginal = formData.get('include_original') === 'true';
    
    if (!audioFile) {
      return new Response('Audio file is required', { status: 400 });
    }

    if (!openAI.key) {
      return new Response('Missing OPENAI_API_KEY', { status: 400 });
    }

    let originalTranscription = null;
    let translation = null;

    // Step 1: Transcribe the audio first (if includeOriginal is true)
    if (includeOriginal) {
      const transcriptionForm = new FormData();
      transcriptionForm.append('file', audioFile);
      transcriptionForm.append('model', openAI.sttModel);
      transcriptionForm.append('response_format', 'json');

      const transcriptionResponse = await fetch(`${openAI.baseUrl}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAI.key}`,
        },
        body: transcriptionForm,
      });

      if (transcriptionResponse.ok) {
        const transcriptionData = await transcriptionResponse.json();
        originalTranscription = transcriptionData.text;
      }
    }

    // Step 2: Use OpenAI's translation endpoint
    const translationForm = new FormData();
    translationForm.append('file', audioFile);
    translationForm.append('model', openAI.sttModel);
    translationForm.append('response_format', 'json');

    const translationResponse = await fetch(`${openAI.baseUrl}/audio/translations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAI.key}`,
      },
      body: translationForm,
    });

    if (!translationResponse.ok) {
      const error = await translationResponse.text();
      return new Response(error, { status: translationResponse.status });
    }

    const translationData = await translationResponse.json();
    translation = translationData.text;

    // Step 3: If target language is not English, translate further using LLM
    if (targetLanguage.toLowerCase() !== 'english' && targetLanguage.toLowerCase() !== 'en') {
      const provider = defaultProvider === 'openrouter' ? openRouter : openAI;
      
      if (provider.key) {
        const llmTranslationResponse = await fetch(`${provider.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${provider.key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: provider.textModel,
            messages: [
              {
                role: 'system',
                content: `You are a professional translator. Translate the following text to ${targetLanguage}. Provide only the translation without any additional commentary.`
              },
              {
                role: 'user',
                content: translation
              }
            ],
            temperature: 0.3,
            max_tokens: 1000,
          }),
        });

        if (llmTranslationResponse.ok) {
          const llmData = await llmTranslationResponse.json();
          translation = llmData.choices[0].message.content;
        }
      }
    }

    const result = {
      translation: translation,
      originalTranscription: originalTranscription,
      metadata: {
        filename: audioFile.name,
        fileSize: audioFile.size,
        fileType: audioFile.type,
        targetLanguage: targetLanguage,
        includeOriginal: includeOriginal,
        hasOriginalTranscription: !!originalTranscription,
        timestamp: new Date().toISOString(),
        model: openAI.sttModel
      }
    };

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Translation error:', error);
    return new Response(error.message, { status: 500 });
  }
}
