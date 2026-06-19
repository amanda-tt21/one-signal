import { NextRequest, NextResponse } from 'next/server';
import { processScheduledItems } from '@/lib/content/scheduler';

// Called every hour by Vercel Cron. Secured with a shared secret.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = await processScheduledItems();
    return NextResponse.json({ processed: results.length, results });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
