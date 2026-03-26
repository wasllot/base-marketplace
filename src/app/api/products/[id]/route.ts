/**
 * GET    /api/products/[id]  — Get single product
 * PUT    /api/products/[id]  — Update product
 * DELETE /api/products/[id]  — Delete product
 */
import { NextRequest } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/api/bff';
import { successResponse, errorResponse } from '@/lib/api/errors';

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    return successResponse(product);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const product = await updateProduct(id, body);
    return successResponse(product, 200, 'Product updated');
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await deleteProduct(id);
    return successResponse(null, 200, 'Product deleted');
  } catch (err) {
    return errorResponse(err);
  }
}
