import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/storage';

export async function GET() {
  const store = getStore();
  const templates = await store.listTemplates();
  return NextResponse.json({ templates });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.type || !body.prompt) {
      return NextResponse.json({ error: 'name, type, and prompt are required' }, { status: 400 });
    }
    const store = getStore();
    const template = await store.insertTemplate(body);
    return NextResponse.json({ template });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}
