/**
 * GET /api/search  — Advanced search with all filter options + pagination meta
 * Returns paginated response with total, pages, etc.
 */
import { NextRequest } from 'next/server';
import { getAllProducts } from '@/lib/api/bff';
import { successResponse, errorResponse } from '@/lib/api/errors';
import { SearchFilters } from '@/lib/api/types';

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const filters: SearchFilters = {
      query:       sp.get('q') || sp.get('query')  || undefined,
      category:    sp.get('category')              || undefined,
      subcategory: sp.get('subcategory')           || undefined,
      brand:       sp.get('brand')                 || undefined,
      condition:   sp.get('condition')             || undefined,
      tags:        sp.get('tags')                  || undefined,
      minPrice:    sp.get('minPrice') ? Number(sp.get('minPrice')) : undefined,
      maxPrice:    sp.get('maxPrice') ? Number(sp.get('maxPrice')) : undefined,
      inStock:     sp.get('inStock') === 'true'    || undefined,
      sort:        (sp.get('sort') as SearchFilters['sort']) || 'featured',
      page:        sp.get('page')  ? Number(sp.get('page'))  : 1,
      limit:       sp.get('limit') ? Number(sp.get('limit')) : 12,
    };

    const result = await getAllProducts(filters);
    return successResponse(result, 200);
  } catch (err) {
    return errorResponse(err);
  }
}
