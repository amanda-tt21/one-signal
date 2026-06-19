import OpenAI from 'openai';
import { ContentType, BrandVoice } from '@/types/content';

const genAI = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

interface GenerateOptions {
  type: ContentType;
  prompt: string;
  audience?: string;
  url?: string;
  brandVoice?: BrandVoice | null;
}

interface GeneratedContent {
  title?: string;
  body: string;
  subject?: string;
}

const BASE_PROMPTS: Record<ContentType, string> = {
  push: `You write short mobile push notifications.
- title: max 50 characters, punchy and curiosity-driven
- body: max 100 characters, direct and clear
Respond with valid JSON only, no markdown: {"title": "...", "body": "..."}`,

  web_push: `You write browser push notifications.
- title: max 50 characters, punchy and curiosity-driven
- body: max 100 characters, direct and clear
Respond with valid JSON only, no markdown: {"title": "...", "body": "..."}`,

  email: `You write email newsletters.
- subject: max 60 characters, honest and clear
- body: HTML string with intro, main content, one clear CTA, and an unsubscribe line at the bottom
Respond with valid JSON only, no markdown: {"subject": "...", "body": "..."}`,
};

function buildSystemPrompt(type: ContentType, voice?: BrandVoice | null): string {
  let prompt = BASE_PROMPTS[type];

  if (voice && Object.values(voice).some(Boolean)) {
    const lines = ['', 'Brand voice guidelines (always apply these):'];
    if (voice.brand_name) lines.push(`- Brand name: ${voice.brand_name}`);
    if (voice.tone)       lines.push(`- Tone: ${voice.tone}`);
    if (voice.keywords)   lines.push(`- Keywords to weave in: ${voice.keywords}`);
    if (voice.avoid)      lines.push(`- Avoid: ${voice.avoid}`);
    prompt += lines.join('\n');
  }

  return prompt;
}

export async function generateContent(options: GenerateOptions): Promise<GeneratedContent> {
  const { type, prompt, audience, url, brandVoice } = options;

  const userMessage = [
    `Write a ${type} notification.`,
    audience ? `Audience: ${audience}` : null,
    url      ? `Link: ${url}` : null,
    `Topic: ${prompt}`,
  ].filter(Boolean).join('\n');

  const response = await genAI.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    max_tokens: 512,
    messages: [
      { role: 'system', content: buildSystemPrompt(type, brandVoice) },
      { role: 'user',   content: userMessage },
    ],
  });

  const text = response.choices[0]?.message?.content ?? '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Model did not return valid JSON');

  return JSON.parse(jsonMatch[0]) as GeneratedContent;
}
