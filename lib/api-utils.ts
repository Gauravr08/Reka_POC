// Utility functions for API routes

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
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
