/**
 * DELETE /api/wishlist/[id]  — Remove item from wishlist
 */
import { NextRequest } from 'next/server';
import { removeFromWishlist } from '@/lib/api/bff';
import { successResponse, errorResponse } from '@/lib/api/errors';

interface Params { params: Promise<{ id: string }> }

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await removeFromWishlist(id);
    return successResponse(null, 200, 'Removed from wishlist');
  } catch (err) {
    return errorResponse(err);
  }
}
