# REKA•POC API Documentation

This document describes all the API endpoints available in the REKA•POC application.

## Environment Setup

Before using the API, ensure you have the following environment variables configured:

### Required API Keys
- `OPENAI_API_KEY` or `OPENROUTER_API_KEY` (at least one required)
- `EXA_API_KEY` (for enhanced search capabilities)

### Optional API Keys
- `AZURE_SPEECH_KEY` & `AZURE_SPEECH_REGION` (for advanced speech features)
- `GOOGLE_TRANSLATE_API_KEY` (for translation services)
- `PINECONE_API_KEY` & `PINECONE_ENVIRONMENT` (for vector search)
- `ANTHROPIC_API_KEY` (for Claude models)

## API Endpoints

### 🔍 Vision Module

#### 1. Reel Generation
- **Endpoint:** `POST /api/vision/reel-generation`
- **Description:** Generate detailed video reel concepts and production guides
- **Body:**
  ```json
  {
    "prompt": "Create a cooking tutorial reel",
    "style": "cinematic", // optional: cinematic, casual, professional
    "duration": "15s", // optional: 15s, 30s, 60s
    "aspectRatio": "9:16" // optional: 9:16, 16:9, 1:1
  }
  ```

#### 2. Archive Search
- **Endpoint:** `POST /api/vision/archive-search`
- **Description:** Search and analyze visual archives with AI assistance
- **Body:**
  ```json
  {
    "query": "vintage posters 1950s",
    "imageUrl": "https://example.com/image.jpg", // optional
    "searchType": "visual", // optional: visual, historical, technical
    "filters": {} // optional metadata filters
  }
  ```

#### 3. Visual Question Answering
- **Endpoint:** `POST /api/vision/question-answering`
- **Description:** Ask detailed questions about images
- **Body:**
  ```json
  {
    "question": "What architectural style is this building?",
    "imageUrl": "https://example.com/building.jpg",
    "context": "Additional context about the image" // optional
  }
  ```

### 🔬 Research Module

#### 1. Web Search
- **Endpoint:** `POST /api/research/web-search`
- **Description:** Enhanced web search with AI analysis using EXA API
- **Body:**
  ```json
  {
    "query": "artificial intelligence trends 2024",
    "searchType": "neural", // optional: neural, keyword
    "numResults": 10, // optional, default: 10
    "includeContent": true // optional, default: true
  }
  ```

#### 2. Document Research
- **Endpoint:** `POST /api/research/document-research`
- **Description:** Analyze multiple documents and synthesize research findings
- **Body:**
  ```json
  {
    "documents": [
      {
        "title": "Document 1",
        "content": "Document text content",
        "url": "https://example.com/doc1.pdf", // optional
        "metadata": {} // optional
      }
    ],
    "query": "What are the main themes?",
    "researchType": "analysis" // optional: analysis, summary, comparison
  }
  ```

#### 3. Domain Research
- **Endpoint:** `POST /api/research/domain-research`
- **Description:** Comprehensive domain analysis with market insights
- **Body:**
  ```json
  {
    "domain": "renewable energy",
    "researchDepth": "comprehensive", // optional: basic, comprehensive
    "focusAreas": ["technology", "market"], // optional
    "excludeAreas": ["politics"] // optional
  }
  ```

### 💬 Chat Module

#### 1. Image Analysis Chat
- **Endpoint:** `POST /api/chat/image-analysis`
- **Description:** Conversational image analysis with streaming responses
- **Body:**
  ```json
  {
    "messages": [
      {
        "role": "user",
        "content": "Analyze this image",
        "includeImage": true
      }
    ],
    "imageUrl": "https://example.com/image.jpg",
    "analysisType": "comprehensive" // optional
  }
  ```

#### 2. Code Analysis Chat
- **Endpoint:** `POST /api/chat/code-analysis`
- **Description:** Interactive code review and analysis
- **Body:**
  ```json
  {
    "messages": [
      {
        "role": "user",
        "content": "Review this code for bugs"
      }
    ],
    "codeContext": "function example() { ... }", // optional
    "language": "javascript" // optional: auto-detect
  }
  ```

#### 3. Multilingual Chat
- **Endpoint:** `POST /api/chat/multilingual-chat`
- **Description:** Chat in multiple languages with translation support
- **Body:**
  ```json
  {
    "messages": [
      {
        "role": "user",
        "content": "Hello, how are you?"
      }
    ],
    "targetLanguage": "spanish", // optional: auto
    "sourceLanguage": "english", // optional: auto
    "translationMode": false // optional
  }
  ```

### 🎤 Speech Module

#### 1. Enhanced Transcription
- **Endpoint:** `POST /api/speech/transcription`
- **Description:** Advanced audio transcription with metadata
- **Content-Type:** `multipart/form-data`
- **Form Fields:**
  - `audio`: Audio file (mp3, wav, m4a, ogg)
  - `language`: Language code (optional, auto-detect)
  - `response_format`: json or text (optional, default: json)
  - `include_timestamps`: true/false (optional)

#### 2. Audio Translation
- **Endpoint:** `POST /api/speech/translation`
- **Description:** Translate audio to different languages
- **Content-Type:** `multipart/form-data`
- **Form Fields:**
  - `audio`: Audio file
  - `target_language`: Target language (default: english)
  - `include_original`: true/false (optional)

#### 3. Speech-to-Speech
- **Endpoint:** `POST /api/speech/speech-to-speech`
- **Description:** Translate speech and convert back to audio
- **Content-Type:** `multipart/form-data`
- **Form Fields:**
  - `audio`: Input audio file
  - `target_language`: Target language (optional: english)
  - `voice`: Voice type (optional: alloy, echo, fable, onyx, nova, shimmer)
  - `preserve_emotion`: true/false (optional)

### Legacy Endpoints

#### Chat
- **Endpoint:** `POST /api/chat`
- **Description:** Basic chat functionality

#### Research
- **Endpoint:** `POST /api/research`
- **Description:** Basic research functionality

#### Vision
- **Endpoint:** `POST /api/vision`
- **Description:** Basic vision analysis

#### Speech STT
- **Endpoint:** `POST /api/speech/stt`
- **Description:** Basic speech-to-text

#### Speech TTS
- **Endpoint:** `POST /api/speech/tts`
- **Description:** Basic text-to-speech

## Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "metadata": {
    "timestamp": "2024-01-01T00:00:00Z",
    "model": "gpt-4o-mini",
    ...
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

### Streaming Responses
Some endpoints (chat-based) return streaming text responses with `Content-Type: text/plain`.

### Audio Responses
Speech endpoints may return audio files with `Content-Type: audio/mpeg` and metadata in custom headers.

## Rate Limiting

- Default: 60 requests per minute per IP
- Configurable via `RATE_LIMIT_RPM` environment variable
- Returns `429 Too Many Requests` when exceeded

## File Upload Limits

- Maximum file size: 50MB (configurable via `MAX_FILE_SIZE`)
- Supported audio formats: mp3, wav, m4a, ogg, flac
- Supported image formats: jpg, jpeg, png, gif, webp
- Supported document formats: pdf, txt, md, docx

## Error Codes

- `400` - Bad Request (missing parameters, invalid format)
- `401` - Unauthorized (missing or invalid API keys)
- `413` - Payload Too Large (file size exceeds limit)
- `415` - Unsupported Media Type (invalid file format)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error (processing error)

## Development

To add new API endpoints:

1. Create a new directory under `/app/api/`
2. Add a `route.ts` file with your handler
3. Use the utilities in `/lib/api-utils.ts` for common functionality
4. Update this documentation

## Testing

Use tools like Postman, curl, or your frontend application to test the endpoints. Ensure you have the required API keys configured in your environment.
