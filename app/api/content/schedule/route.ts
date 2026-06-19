import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/storage';
import { ScheduleRequest } from '@/types/content';

export async function POST(req: NextRequest) {
  try {
    const body: ScheduleRequest = await req.json();

    if (!body.content_id || !body.scheduled_at) {
      return NextResponse.json(
        { error: 'content_id and scheduled_at are required' },
        { status: 400 }
      );
    }

    const store = getStore();
    const updated = await store.updateContentStatus(body.content_id, 'scheduled', {
      scheduled_at: body.scheduled_at,
    });

    return NextResponse.json({ content: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
