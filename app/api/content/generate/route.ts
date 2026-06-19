import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/content/generator';
import { getStore } from '@/lib/storage';
import { GenerateRequest } from '@/types/content';

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();
    if (!body.type || !body.prompt) {
      return NextResponse.json({ error: 'type and prompt are required' }, { status: 400 });
    }

    const store = getStore();
    const brandVoice = await store.getBrandVoice();
    const generated = await generateContent({ ...body, brandVoice });

    const saved = await store.insertContentItem({
      type:     body.type,
      title:    generated.title,
      body:     generated.body,
      subject:  generated.subject,
      audience: body.audience,
      status:   'draft',
      metadata: body.url ? { url: body.url } : undefined,
    });

    return NextResponse.json({ content: saved });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}
