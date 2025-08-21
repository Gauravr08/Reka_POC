import { NextRequest } from 'next/server';
import { openAI } from '@/lib/providers';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;
    const language = formData.get('language') as string || 'auto';
    const responseFormat = formData.get('response_format') as string || 'json';
    const includeTimestamps = formData.get('include_timestamps') === 'true';
    
    if (!audioFile) {
      return new Response('Audio file is required', { status: 400 });
    }

    if (!openAI.key) {
      return new Response('Missing OPENAI_API_KEY', { status: 400 });
    }

    // Prepare the transcription request
    const transcriptionForm = new FormData();
    transcriptionForm.append('file', audioFile);
    transcriptionForm.append('model', openAI.sttModel);
    
    if (language !== 'auto') {
      transcriptionForm.append('language', language);
    }
    
    if (includeTimestamps) {
      transcriptionForm.append('response_format', 'verbose_json');
      transcriptionForm.append('timestamp_granularities[]', 'word');
      transcriptionForm.append('timestamp_granularities[]', 'segment');
    } else {
      transcriptionForm.append('response_format', responseFormat);
    }

    const response = await fetch(`${openAI.baseUrl}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAI.key}`,
      },
      body: transcriptionForm,
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(error, { status: response.status });
    }

    const transcriptionData = await response.json();
    
    // Enhanced response with additional metadata
    const result = {
      transcription: transcriptionData,
      metadata: {
        filename: audioFile.name,
        fileSize: audioFile.size,
        fileType: audioFile.type,
        language: language,
        responseFormat: responseFormat,
        includeTimestamps: includeTimestamps,
        duration: transcriptionData.duration || null,
        wordCount: transcriptionData.text ? transcriptionData.text.split(' ').length : 0,
        timestamp: new Date().toISOString(),
        model: openAI.sttModel
      }
    };

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Transcription error:', error);
    return new Response(error.message, { status: 500 });
  }
}
