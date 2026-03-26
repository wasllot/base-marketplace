import { NextResponse } from 'next/server';
import localData from '@/lib/data/products.json';
import { User } from '@/lib/api/types';

const user: User = localData.user as User;

export async function GET() {
  return NextResponse.json(user);
}
