import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/storage';

export async function GET() {
  const store = getStore();
  const voice = await store.getBrandVoice();
  return NextResponse.json({ voice: voice ?? {} });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const store = getStore();
    const voice = await store.setBrandVoice(body);
    return NextResponse.json({ voice });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}
