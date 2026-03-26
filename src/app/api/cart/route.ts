/**
 * GET  /api/cart       — Get current cart
 * POST /api/cart       — Add item to cart
 * DELETE /api/cart     — Clear entire cart
 */
import { NextRequest } from 'next/server';
import { getCart, addToCart } from '@/lib/api/bff';
import { successResponse, errorResponse } from '@/lib/api/errors';
import { CartRepository } from '@/lib/api/repository';

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.headers.get('x-session-id') || 'default';
    const cart = await getCart(sessionId);
    return successResponse(cart);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.headers.get('x-session-id') || 'default';
    const body = await request.json();
    const { productId, quantity = 1, size, color } = body;
    const cart = await addToCart(productId, quantity, sessionId, { size, color });
    return successResponse(cart, 201, 'Item added to cart');
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.headers.get('x-session-id') || 'default';
    CartRepository.clearCart(sessionId);
    return successResponse(null, 200, 'Cart cleared');
  } catch (err) {
    return errorResponse(err);
  }
}
