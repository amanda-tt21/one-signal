import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/storage';
import { ContentStatus } from '@/types/content';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as ContentStatus | null;
    const type = searchParams.get('type');

    const store = getStore();
    const items = await store.listContentItems({
      status: status ?? undefined,
      type: type ?? undefined,
    });

    return NextResponse.json({ items });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
