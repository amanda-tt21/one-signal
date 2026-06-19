import { ContentType } from '@/types/content';

const DIMENSIONS: Record<ContentType, { width: number; height: number }> = {
  push:     { width: 1440, height: 720 },
  web_push: { width: 1440, height: 720 },
  email:    { width: 1080, height: 1080 },
};

export async function generateImage(prompt: string, type: ContentType): Promise<string> {
  const { width, height } = DIMENSIONS[type];
  const encoded = encodeURIComponent(
    `${prompt}. Professional marketing photo, clean composition, vibrant, no text.`
  );
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true&enhance=true`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Pollinations returned ${res.status}`);

  const buffer = await res.arrayBuffer();
  const b64 = Buffer.from(buffer).toString('base64');
  const mime = res.headers.get('content-type') ?? 'image/jpeg';
  return `data:${mime};base64,${b64}`;
}
