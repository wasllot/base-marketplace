import { NextRequest, NextResponse } from 'next/server';

const REAL_API_URL = process.env.API_URL || 'https://api.reinaldotineo.online';

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const url = new URL(req.url);
  
  const targetUrl = `${REAL_API_URL}/${path}${url.search}`;

  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('connection');
  
  try {
    const res = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined,
      redirect: 'manual',
      cache: 'no-store'
    });

    const body = await res.arrayBuffer();
    const responseHeaders = new Headers(res.headers);
    responseHeaders.delete('content-encoding'); 
    responseHeaders.delete('content-length');

    return new NextResponse(body, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    console.error('BFF Proxy Error:', err);
    return NextResponse.json({ error: 'BFF Proxy Error' }, { status: 502 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
