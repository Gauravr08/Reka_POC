import { NextRequest } from 'next/server';
import { openAI, openRouter, defaultProvider } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;
    const targetLanguage = formData.get('target_language') as string || 'english';
    const voiceType = formData.get('voice') as string || 'alloy';
    const preserveEmotion = formData.get('preserve_emotion') === 'true';
    
    if (!audioFile) {
      return new Response('Audio file is required', { status: 400 });
    }

    if (!openAI.key) {
      return new Response('Missing OPENAI_API_KEY', { status: 400 });
    }

    // Step 1: Transcribe the original audio
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

    if (!transcriptionResponse.ok) {
      const error = await transcriptionResponse.text();
      return new Response(`Transcription failed: ${error}`, { status: transcriptionResponse.status });
    }

    const transcriptionData = await transcriptionResponse.json();
    let textToSpeech = transcriptionData.text;

    // Step 2: Translate to target language if needed
    if (targetLanguage.toLowerCase() !== 'auto' && targetLanguage.toLowerCase() !== 'english' && targetLanguage.toLowerCase() !== 'en') {
      const provider = defaultProvider === 'openrouter' ? openRouter : openAI;
      
      if (provider.key) {
        const translationPrompt = preserveEmotion 
          ? `Translate the following text to ${targetLanguage}, preserving the emotional tone and speaking style: "${textToSpeech}"`
          : `Translate the following text to ${targetLanguage}: "${textToSpeech}"`;

        const translationResponse = await fetch(`${provider.baseUrl}/chat/completions`, {
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
                content: 'You are a professional translator. Provide only the translation without any additional commentary.'
              },
              {
                role: 'user',
                content: translationPrompt
              }
            ],
            temperature: 0.3,
            max_tokens: 1000,
          }),
        });

        if (translationResponse.ok) {
          const translationData = await translationResponse.json();
          textToSpeech = translationData.choices[0].message.content;
        }
      }
    }

    // Step 3: Convert translated text to speech
    const ttsResponse = await fetch(`${openAI.baseUrl}/audio/speech`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAI.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: openAI.ttsModel,
        voice: voiceType,
        input: textToSpeech,
        response_format: 'mp3'
      }),
    });

    if (!ttsResponse.ok) {
      const error = await ttsResponse.text();
      return new Response(`Text-to-speech failed: ${error}`, { status: ttsResponse.status });
    }

    // Return the audio file with metadata headers
    return new Response(ttsResponse.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="speech-to-speech.mp3"',
        'X-Original-Text': encodeURIComponent(transcriptionData.text),
        'X-Translated-Text': encodeURIComponent(textToSpeech),
        'X-Target-Language': targetLanguage,
        'X-Voice-Type': voiceType,
        'X-Preserve-Emotion': preserveEmotion.toString(),
        'X-Timestamp': new Date().toISOString(),
      },
    });

  } catch (error: any) {
    console.error('Speech-to-speech error:', error);
    return new Response(error.message, { status: 500 });
  }
}
