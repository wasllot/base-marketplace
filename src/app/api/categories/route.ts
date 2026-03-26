/**
 * GET  /api/categories  — Get categories, brands, conditions for filter UI
 */
import { NextRequest } from 'next/server';
import { getFilterOptions } from '@/lib/api/bff';
import { successResponse, errorResponse } from '@/lib/api/errors';

export async function GET(_request: NextRequest) {
  try {
    const data = await getFilterOptions();
    return successResponse(data);
  } catch (err) {
    return errorResponse(err);
  }
}
