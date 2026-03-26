/**
 * GET  /api/products          — List products with filters, sorting, pagination
 * POST /api/products          — Create a new product
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/api/bff';
import { successResponse, errorResponse } from '@/lib/api/errors';
import { SearchFilters } from '@/lib/api/types';

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const filters: SearchFilters = {
      query:       sp.get('query')       || undefined,
      category:    sp.get('category')    || undefined,
      subcategory: sp.get('subcategory') || undefined,
      brand:       sp.get('brand')       || undefined,
      condition:   sp.get('condition')   || undefined,
      tags:        sp.get('tags')        || undefined,
      minPrice:    sp.get('minPrice')    ? Number(sp.get('minPrice'))  : undefined,
      maxPrice:    sp.get('maxPrice')    ? Number(sp.get('maxPrice'))  : undefined,
      inStock:     sp.get('inStock') === 'true' || undefined,
      sort:        (sp.get('sort') as SearchFilters['sort'])           || 'featured',
      page:        sp.get('page')        ? Number(sp.get('page'))      : 1,
      limit:       sp.get('limit')       ? Number(sp.get('limit'))     : 48,
    };

    const result = await getAllProducts(filters);
    // Return the array directly for backward compatibility with the homepage and marketplace page
    return NextResponse.json(result.data);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = await createProduct(body);
    return successResponse(product, 201, 'Product created successfully');
  } catch (err) {
    return errorResponse(err);
  }
}
