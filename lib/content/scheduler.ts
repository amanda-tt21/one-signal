import { getStore } from '@/lib/storage';
import { sendEmail } from '@/lib/providers/resend';
import { sendPushViaOneSignal } from '@/lib/providers/onesignal';
import { ContentItem } from '@/types/content';

async function dispatchItem(item: ContentItem) {
  const store = getStore();

  if (item.type === 'email') {
    if (!item.subject) throw new Error('Email missing subject');
    await sendEmail({
      to: item.audience ?? '',
      subject: item.subject,
      html: item.body,
    });
    await store.insertSendLog({ content_id: item.id, channel: 'email', provider: 'resend', status: 'sent' });
    return;
  }

  if (item.type === 'push' || item.type === 'web_push') {
    const url = (item.metadata as Record<string, string> | undefined)?.url;
    await sendPushViaOneSignal({ title: item.title ?? '', body: item.body, url, audience: item.audience });
    await store.insertSendLog({ content_id: item.id, channel: item.type, provider: 'onesignal', status: 'sent' });
    return;
  }

  throw new Error(`Unknown content type: ${item.type}`);
}

export async function processScheduledItems() {
  const store = getStore();
  const dueItems = await store.getDueItems();

  const results = await Promise.allSettled(
    dueItems.map(async (item) => {
      try {
        await dispatchItem(item);
        await store.updateContentStatus(item.id, 'sent', { sent_at: new Date().toISOString() });
        return { id: item.id, status: 'sent' };
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        await store.updateContentStatus(item.id, 'failed');
        await store.insertSendLog({ content_id: item.id, channel: item.type, provider: item.type === 'email' ? 'resend' : 'onesignal', status: 'failed', error });
        return { id: item.id, status: 'failed', error };
      }
    })
  );

  return results.map((r) => (r.status === 'fulfilled' ? r.value : { error: String(r.reason) }));
}
