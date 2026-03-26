/**
 * PUT    /api/cart/[id]  — Update cart item quantity
 * DELETE /api/cart/[id]  — Remove specific item from cart
 */
import { NextRequest } from 'next/server';
import { updateCartItem, removeFromCart } from '@/lib/api/bff';
import { successResponse, errorResponse } from '@/lib/api/errors';

interface Params { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const sessionId = request.headers.get('x-session-id') || 'default';
    const { quantity } = await request.json();
    const cart = await updateCartItem(id, quantity, sessionId);
    return successResponse(cart, 200, 'Cart updated');
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const sessionId = request.headers.get('x-session-id') || 'default';
    const cart = await removeFromCart(id, sessionId);
    return successResponse(cart, 200, 'Item removed from cart');
  } catch (err) {
    return errorResponse(err);
  }
}
