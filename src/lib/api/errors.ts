import { NextResponse } from 'next/server';
import { ApiError } from './types';

// ─── Custom Error Classes ─────────────────────────────────────────────────────

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'INTERNAL_ERROR',
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      id ? `${resource} with id '${id}' not found` : `${resource} not found`,
      'NOT_FOUND',
      404
    );
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
  }
}

// ─── Response Helpers ─────────────────────────────────────────────────────────

export function successResponse<T>(data: T, status = 200, message?: string) {
  return NextResponse.json(
    { success: true, data, ...(message ? { message } : {}) },
    { status }
  );
}

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof AppError) {
    const body: ApiError = {
      success: false,
      error: error.message,
      code: error.code,
    };
    return NextResponse.json(body, { status: error.statusCode });
  }

  console.error('[API Error]', error);
  const body: ApiError = {
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  };
  return NextResponse.json(body, { status: 500 });
}
