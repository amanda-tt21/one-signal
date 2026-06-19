import { ContentItem, ContentStatus, Template, BrandVoice } from '@/types/content';

export interface SendLogEntry {
  id: string;
  content_id: string;
  channel: string;
  provider: string;
  provider_id?: string;
  status: string;
  error?: string;
  sent_at: string;
}

export interface Store {
  insertContentItem(item: Omit<ContentItem, 'id' | 'created_at'>): Promise<ContentItem>;
  updateContentStatus(id: string, status: ContentStatus, extra?: Partial<ContentItem>): Promise<ContentItem>;
  listContentItems(filters?: { status?: ContentStatus; type?: string }): Promise<ContentItem[]>;
  getDueItems(): Promise<ContentItem[]>;
  insertSendLog(log: Omit<SendLogEntry, 'id' | 'sent_at'>): Promise<void>;
  insertTemplate(t: Omit<Template, 'id' | 'created_at'>): Promise<Template>;
  listTemplates(): Promise<Template[]>;
  deleteTemplate(id: string): Promise<void>;
  getBrandVoice(): Promise<BrandVoice | null>;
  setBrandVoice(voice: BrandVoice): Promise<BrandVoice>;
}
