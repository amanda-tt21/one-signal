import { SupabaseClient } from '@supabase/supabase-js';
import { ContentItem, ContentStatus } from '@/types/content';

export async function insertContentItem(
  client: SupabaseClient,
  item: Omit<ContentItem, 'id' | 'created_at'>
) {
  const { data, error } = await client
    .from('content_items')
    .insert(item)
    .select()
    .single();
  if (error) throw error;
  return data as ContentItem;
}

export async function updateContentStatus(
  client: SupabaseClient,
  id: string,
  status: ContentStatus,
  extra?: Partial<ContentItem>
) {
  const { data, error } = await client
    .from('content_items')
    .update({ status, ...extra })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as ContentItem;
}

export async function listContentItems(
  client: SupabaseClient,
  filters?: { status?: ContentStatus; type?: string }
) {
  let query = client
    .from('content_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.type) query = query.eq('type', filters.type);

  const { data, error } = await query;
  if (error) throw error;
  return data as ContentItem[];
}

export async function getDueItems(client: SupabaseClient) {
  const { data, error } = await client
    .from('content_items')
    .select('*')
    .eq('status', 'scheduled')
    .lte('scheduled_at', new Date().toISOString());
  if (error) throw error;
  return data as ContentItem[];
}

export async function insertSendLog(
  client: SupabaseClient,
  log: {
    content_id: string;
    channel: string;
    provider: string;
    provider_id?: string;
    status: string;
    error?: string;
  }
) {
  const { error } = await client.from('send_log').insert(log);
  if (error) throw error;
}
