import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/content/image-generator';
import { getStore } from '@/lib/storage';
import { ContentType } from '@/types/content';

export async function POST(req: NextRequest) {
  try {
    const { content_id, prompt, type } = await req.json() as {
      content_id: string;
      prompt: string;
      type: ContentType;
    };

    if (!content_id || !prompt || !type) {
      return NextResponse.json({ error: 'content_id, prompt, and type are required' }, { status: 400 });
    }

    let imageUrl: string;
    try {
      imageUrl = await generateImage(prompt, type);
    } catch (imgErr) {
      const message = imgErr instanceof Error ? imgErr.message : String(imgErr);
      console.error('[generate-image]', message);
      return NextResponse.json({ error: message }, { status: 500 });
    }

    const store = getStore();
    const items = await store.listContentItems();
    const item = items.find(i => i.id === content_id);
    if (item) {
      await store.updateContentStatus(item.id, item.status, {
        metadata: { ...(item.metadata ?? {}), imageUrl },
      });
    }

    return NextResponse.json({ imageUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
