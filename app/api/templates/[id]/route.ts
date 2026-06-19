import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/storage';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = getStore();
  await store.deleteTemplate(id);
  return NextResponse.json({ ok: true });
}
