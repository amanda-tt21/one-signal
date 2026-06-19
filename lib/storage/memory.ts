import { ContentItem, ContentStatus, Template, BrandVoice } from '@/types/content';
import { Store, SendLogEntry } from './types';

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const items     = new Map<string, ContentItem>();
const templates = new Map<string, Template>();
const logs: SendLogEntry[] = [];
let brandVoice: BrandVoice | null = null;

export const memoryStore: Store = {
  async insertContentItem(item) {
    const record: ContentItem = { ...item, id: uuid(), created_at: new Date().toISOString() };
    items.set(record.id, record);
    return record;
  },

  async updateContentStatus(id, status, extra) {
    const existing = items.get(id);
    if (!existing) throw new Error(`Content item ${id} not found`);
    const updated = { ...existing, ...extra, status };
    items.set(id, updated);
    return updated;
  },

  async listContentItems(filters) {
    let all = Array.from(items.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    if (filters?.status) all = all.filter(i => i.status === filters.status);
    if (filters?.type)   all = all.filter(i => i.type   === filters.type);
    return all;
  },

  async getDueItems() {
    const now = new Date();
    return Array.from(items.values()).filter(
      i => i.status === 'scheduled' && i.scheduled_at && new Date(i.scheduled_at) <= now
    );
  },

  async insertSendLog(log) {
    logs.push({ ...log, id: uuid(), sent_at: new Date().toISOString() });
  },

  async insertTemplate(t) {
    const record: Template = { ...t, id: uuid(), created_at: new Date().toISOString() };
    templates.set(record.id, record);
    return record;
  },

  async listTemplates() {
    return Array.from(templates.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  async deleteTemplate(id) {
    templates.delete(id);
  },

  async getBrandVoice() {
    return brandVoice;
  },

  async setBrandVoice(voice) {
    brandVoice = voice;
    return voice;
  },
};
