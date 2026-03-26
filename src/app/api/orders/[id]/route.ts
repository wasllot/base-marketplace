/**
 * GET /api/orders/[id]  — Get order by ID
 */
import { NextRequest } from 'next/server';
import { getOrderById } from '@/lib/api/bff';
import { successResponse, errorResponse } from '@/lib/api/errors';

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);
    return successResponse(order);
  } catch (err) {
    return errorResponse(err);
  }
}
