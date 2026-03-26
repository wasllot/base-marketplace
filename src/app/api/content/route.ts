import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const contentPath = join(process.cwd(), 'src/lib/data/site-content.json');

function readContent() {
  try {
    const raw = readFileSync(contentPath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeContent(data: unknown) {
  writeFileSync(contentPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const content = readContent();
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid content data' }, { status: 400 });
    }
    writeContent(body);
    return NextResponse.json({ success: true, content: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
