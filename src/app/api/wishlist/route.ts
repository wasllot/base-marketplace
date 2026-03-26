/**
 * GET    /api/wishlist      — Get wishlist items
 * POST   /api/wishlist      — Add product to wishlist
 */
import { NextRequest } from 'next/server';
import { getWishlist, addToWishlist } from '@/lib/api/bff';
import { successResponse, errorResponse } from '@/lib/api/errors';

export async function GET(_request: NextRequest) {
  try {
    const wishlist = await getWishlist();
    return successResponse(wishlist);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();
    const item = await addToWishlist(productId);
    return successResponse(item, 201, 'Added to wishlist');
  } catch (err) {
    return errorResponse(err);
  }
}
