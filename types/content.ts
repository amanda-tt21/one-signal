export type ContentType = 'push' | 'web_push' | 'email';
export type ContentStatus = 'draft' | 'scheduled' | 'sent' | 'failed';

export interface ContentItem {
  id: string;
  type: ContentType;
  title?: string;
  body: string;
  subject?: string;
  audience?: string;
  status: ContentStatus;
  scheduled_at?: string;
  sent_at?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface SendLog {
  id: string;
  content_id: string;
  channel: string;
  provider: string;
  provider_id?: string;
  status: string;
  error?: string;
  sent_at: string;
}

export interface GenerateRequest {
  type: ContentType;
  prompt: string;
  audience?: string;
  url?: string;
}

export interface ScheduleRequest {
  content_id: string;
  scheduled_at: string;
}

export interface Template {
  id: string;
  name: string;
  type: ContentType;
  prompt: string;
  audience?: string;
  url?: string;
  created_at: string;
}

export interface BrandVoice {
  brand_name?: string;
  tone?: string;
  avoid?: string;
  keywords?: string;
}
