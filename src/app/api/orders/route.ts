/**
 * GET  /api/orders    — List all orders
 * POST /api/orders    — Create new order from cart items
 */
import { NextRequest } from 'next/server';
import { getOrders, createOrder } from '@/lib/api/bff';
import { successResponse, errorResponse } from '@/lib/api/errors';

export async function GET(_request: NextRequest) {
  try {
    const orders = await getOrders();
    return successResponse(orders);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const order = await createOrder(body);
    return successResponse(order, 201, 'Order created successfully');
  } catch (err) {
    return errorResponse(err);
  }
}
