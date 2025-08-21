// Utility functions for API routes

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createSuccessResponse<T>(
  data: T,
  metadata?: Record<string, any>
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    metadata
  };
  
  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export function createErrorResponse(
  error: string | Error,
  statusCode: number = 500
): Response {
  const response: ApiResponse = {
    success: false,
    error: error instanceof Error ? error.message : error
  };
  
  return new Response(JSON.stringify(response), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function validateContentType(
  req: Request,
  expectedTypes: string[]
): boolean {
  const contentType = req.headers.get('content-type') || '';
  return expectedTypes.some(type => contentType.includes(type));
}

export function validateFileSize(
  file: File,
  maxSizeBytes: number
): boolean {
  return file.size <= maxSizeBytes;
}

export function validateFileType(
  file: File,
  allowedTypes: string[]
): boolean {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  return fileExtension ? allowedTypes.includes(fileExtension) : false;
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function parseFormDataField(
  formData: FormData,
  fieldName: string,
  defaultValue?: string
): string | undefined {
  const value = formData.get(fieldName);
  return value ? String(value) : defaultValue;
}

export function parseFormDataBoolean(
  formData: FormData,
  fieldName: string,
  defaultValue: boolean = false
): boolean {
  const value = formData.get(fieldName);
  return value ? String(value).toLowerCase() === 'true' : defaultValue;
}

export function parseFormDataNumber(
  formData: FormData,
  fieldName: string,
  defaultValue?: number
): number | undefined {
  const value = formData.get(fieldName);
  if (value === null) return defaultValue;
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255);
}

export function createStreamingResponse(
  stream: ReadableStream,
  contentType: string = 'text/plain'
): Response {
  return new Response(stream, {
    headers: {
      'Content-Type': contentType,
      'Transfer-Encoding': 'chunked',
    },
  });
}

export function createAudioResponse(
  audioStream: ReadableStream,
  filename: string = 'audio.mp3',
  metadata?: Record<string, string>
): Response {
  const headers: Record<string, string> = {
    'Content-Type': 'audio/mpeg',
    'Content-Disposition': `attachment; filename="${sanitizeFilename(filename)}"`,
  };

  // Add metadata headers
  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      headers[`X-${key}`] = encodeURIComponent(value);
    });
  }

  return new Response(audioStream, { headers });
}

export function logApiCall(
  endpoint: string,
  method: string,
  success: boolean,
  duration?: number,
  metadata?: Record<string, any>
): void {
  const logData = {
    endpoint,
    method,
    success,
    duration,
    timestamp: new Date().toISOString(),
    ...metadata
  };
  
  console.log('API Call:', JSON.stringify(logData));
}

// Rate limiting utilities (basic implementation)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;
  const limit = rateLimitStore.get(key);
  
  if (!limit || now > limit.resetTime) {
    // Reset or initialize
    const resetTime = now + config.windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: config.maxRequests - 1, resetTime };
  }
  
  if (limit.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetTime: limit.resetTime };
  }
  
  limit.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - limit.count,
    resetTime: limit.resetTime
  };
}

export function createRateLimitResponse(resetTime: number): Response {
  return new Response('Rate limit exceeded', {
    status: 429,
    headers: {
      'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
      'X-RateLimit-Reset': resetTime.toString(),
    }
  });
}
