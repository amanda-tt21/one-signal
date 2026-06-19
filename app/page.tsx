'use client';

import { useState, useEffect, useCallback } from 'react';
import { ContentItem, ContentType, Template, BrandVoice } from '@/types/content';

type Step = 1 | 2 | 3 | 4 | 5;

const TYPE_OPTIONS: { value: ContentType; label: string; icon: string }[] = [
  { value: 'push',     label: 'Push notification (mobile)', icon: '📱' },
  { value: 'web_push', label: 'Web push (browser)',          icon: '🖥️' },
  { value: 'email',    label: 'Email newsletter',            icon: '✉️' },
];

const STEPS = [
  { id: 1, label: 'Generate' },
  { id: 2, label: 'Review & schedule' },
  { id: 3, label: 'Content list' },
  { id: 4, label: 'How it works' },
  { id: 5, label: 'Settings' },
];

const STATUS_STYLES: Record<string, string> = {
  draft:     'bg-gray-100 text-gray-500',
  scheduled: 'bg-blue-50 text-blue-600',
  sent:      'bg-green-50 text-green-600',
  failed:    'bg-red-50 text-red-600',
};

function Badge({ status }: { status: string }) {
  return <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-500'}`}>{status}</span>;
}

function CharCount({ value, max }: { value: string; max: number }) {
  return <span className={`text-xs tabular-nums ${value.length > max ? 'text-red-500' : 'text-gray-400'}`}>{value.length} / {max}</span>;
}

function ImageSlot({ imageUrl, loading, aspectRatio }: { imageUrl?: string | null; loading: boolean; aspectRatio: '16/9' | '1/1' }) {
  return (
    <div className="w-full overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center" style={{ aspectRatio }}>
      {loading ? (
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
          <span className="text-xs">Generating image…</span>
        </div>
      ) : imageUrl ? (
        <img src={imageUrl} alt="Generated" className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-1.5 text-gray-300">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          <span className="text-xs">{aspectRatio === '16/9' ? '1440 × 720' : '1080 × 1080'}</span>
        </div>
      )}
    </div>
  );
}

function PhonePreview({ title, body, imageUrl, imageLoading, empty, brandName }: { title?: string; body?: string; imageUrl?: string | null; imageLoading?: boolean; empty: boolean; brandName?: string }) {
  const name = brandName || 'AutoContent';
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[280px] h-[560px] bg-gray-800 rounded-[44px] border-[3px] border-gray-700 shadow-2xl overflow-hidden flex flex-col">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-2xl z-10" />
        <div className="flex-1 bg-gradient-to-b from-slate-700 to-slate-900 flex flex-col items-center pt-12 px-4">
          <div className="w-full flex items-center justify-between px-2 mb-6">
            <span className="text-[10px] font-semibold text-white/50">9:41</span>
            <div className="flex items-center gap-1.5 text-white/40">
              <svg width="12" height="9" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2a9 9 0 0 1 6.5 2.8M1.5 4.8A9 9 0 0 1 8 2M4 7.5A5 5 0 0 1 8 6M12 7.5A5 5 0 0 0 8 6M8 11h.01"/></svg>
              <svg width="14" height="9" viewBox="0 0 22 14" fill="none"><rect x="0.5" y="0.5" width="18" height="13" rx="3" stroke="currentColor" strokeOpacity="0.5"/><rect x="2" y="2" width="12" height="10" rx="2" fill="currentColor"/><path d="M20 5v4a2 2 0 0 0 0-4z" fill="currentColor" fillOpacity="0.4"/></svg>
            </div>
          </div>
          <p className="text-5xl font-thin text-white tracking-tight mb-1">9:41</p>
          <p className="text-[12px] text-white/40 mb-8">Thursday, 19 June</p>
          {empty ? (
            <div className="w-full bg-white/10 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-white/20" /><div className="h-2 w-20 bg-white/20 rounded" /><div className="ml-auto h-2 w-6 bg-white/15 rounded" /></div>
              <div className="h-2.5 w-32 bg-white/15 rounded" />
              <div className="h-2 w-full bg-white/10 rounded" />
              <div className="w-full h-16 bg-white/8 rounded-xl" />
            </div>
          ) : (
            <div className="w-full bg-white/12 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-md bg-violet-500 flex items-center justify-center shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  </div>
                  <span className="text-[9px] font-semibold text-white/50 uppercase tracking-wider">{name}</span>
                  <span className="ml-auto text-[9px] text-white/30">now</span>
                </div>
                <p className="text-[13px] font-semibold text-white leading-snug mb-1">{title}</p>
                <p className="text-[11px] text-white/55 leading-snug">{body}</p>
              </div>
              {imageLoading ? (
                <div className="w-full h-[157px] bg-white/8 flex items-center justify-center"><svg className="animate-spin w-4 h-4 text-white/30" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg></div>
              ) : imageUrl ? (
                <img src={imageUrl} alt="" className="w-full" style={{ aspectRatio: '16/9', objectFit: 'cover' }} />
              ) : (
                <div className="w-full h-[157px] bg-white/6 flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>
              )}
            </div>
          )}
        </div>
        <div className="bg-slate-900 flex justify-center py-2.5"><div className="w-16 h-1 bg-white/20 rounded-full" /></div>
      </div>
      <p className="text-xs text-gray-400 mt-3">iOS lock screen · 1440 × 720</p>
    </div>
  );
}

function BrowserPreview({ title, body, url, imageUrl, imageLoading, empty, brandName }: { title?: string; body?: string; url?: string; imageUrl?: string | null; imageLoading?: boolean; empty: boolean; brandName?: string }) {
  const domain = url ? url.replace(/^https?:\/\//, '').split('/')[0] : 'yoursite.com';
  const name = brandName || 'AutoContent';
  return (
    <div className="flex flex-col items-center">
      <div className="w-[340px] bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
        <div className="bg-gray-900 px-4 py-3 flex items-center gap-2 border-b border-gray-700">
          <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400/70" /><div className="w-3 h-3 rounded-full bg-yellow-400/70" /><div className="w-3 h-3 rounded-full bg-green-400/70" /></div>
          <div className="flex-1 bg-gray-800 rounded-md px-3 py-1.5 ml-2"><span className="text-[11px] text-gray-500">{domain}</span></div>
        </div>
        <div className="bg-gray-950 h-28 px-5 py-4 space-y-2.5">
          <div className="h-2.5 w-3/4 bg-gray-800 rounded" /><div className="h-2 w-full bg-gray-800/60 rounded" /><div className="h-2 w-5/6 bg-gray-800/60 rounded" />
        </div>
        <div className="bg-gray-900 border-t border-gray-700 px-4 py-4">
          <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Browser notification</p>
          {empty ? (
            <div className="bg-gray-800 rounded-xl p-3 flex gap-3"><div className="w-10 h-10 rounded-lg bg-gray-700 shrink-0" /><div className="flex-1 space-y-1.5 pt-0.5"><div className="h-2.5 w-28 bg-gray-700 rounded" /><div className="h-2 w-full bg-gray-700/70 rounded" /></div></div>
          ) : (
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              {imageLoading ? (
                <div className="w-full h-[191px] bg-gray-100 flex items-center justify-center"><svg className="animate-spin w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg></div>
              ) : imageUrl ? (
                <img src={imageUrl} alt="" className="w-full" style={{ aspectRatio: '16/9', objectFit: 'cover' }} />
              ) : (
                <div className="w-full h-[191px] bg-gray-50 flex items-center justify-center border-b border-gray-100"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>
              )}
              <div className="p-3 flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center shrink-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-gray-900 leading-tight mb-0.5 truncate">{title}</p>
                  <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">{body}</p>
                  <p className="text-[10px] text-violet-500 mt-1 truncate">{name} · {domain}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-3">Chrome · desktop · 1440 × 720</p>
    </div>
  );
}

function EmailPreview({ subject, body, imageUrl, imageLoading, empty, brandName }: { subject?: string; body?: string; imageUrl?: string | null; imageLoading?: boolean; empty: boolean; brandName?: string }) {
  return (
    <div className="w-full border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-xs font-semibold text-violet-600">{(brandName || 'A')[0].toUpperCase()}</div>
        <div>
          <p className="text-xs font-medium text-gray-700">{brandName || 'AutoContent'}</p>
          {empty ? <div className="h-2.5 w-32 bg-gray-200 rounded mt-1" /> : <p className="text-xs text-gray-500">{subject}</p>}
        </div>
      </div>
      {!empty && (imageLoading ? (
        <div className="w-full bg-gray-50 flex items-center justify-center" style={{ aspectRatio: '1/1' }}><svg className="animate-spin w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg></div>
      ) : imageUrl ? (
        <img src={imageUrl} alt="" className="w-full" style={{ aspectRatio: '1/1', objectFit: 'cover' }} />
      ) : (
        <div className="w-full bg-gray-50 flex flex-col items-center justify-center gap-1.5" style={{ aspectRatio: '1/1' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span className="text-xs text-gray-300">1080 × 1080</span></div>
      ))}
      <div className="px-5 py-5">{empty ? (<div className="space-y-2.5"><div className="h-2.5 w-3/4 bg-gray-100 rounded" /><div className="h-2 w-full bg-gray-100 rounded" /><div className="h-2 w-5/6 bg-gray-100 rounded" /></div>) : (<div className="text-sm text-gray-700 leading-relaxed [&_p]:mb-3 [&_a]:text-violet-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: body ?? '' }} />)}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════ */
export default function Home() {
  const [step, setStep]                   = useState<Step>(1);
  const [type, setType]                   = useState<ContentType>('push');
  const [prompt, setPrompt]               = useState('');
  const [audience, setAudience]           = useState('');
  const [url, setUrl]                     = useState('');
  const [generating, setGenerating]       = useState(false);
  const [generatingImg, setGeneratingImg] = useState(false);
  const [generated, setGenerated]         = useState<ContentItem | null>(null);
  const [imageUrl, setImageUrl]           = useState<string | null>(null);
  const [scheduleTime, setScheduleTime]   = useState('');
  const [scheduling, setScheduling]       = useState(false);
  const [scheduled, setScheduled]         = useState(false);
  const [error, setError]                 = useState('');
  const [imageError, setImageError]       = useState('');
  const [items, setItems]                 = useState<ContentItem[]>([]);
  const [loadingList, setLoadingList]     = useState(false);
  const [doneSteps, setDoneSteps]         = useState<Set<number>>(new Set());

  // Templates
  const [templates, setTemplates]         = useState<Template[]>([]);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [templateName, setTemplateName]   = useState('');
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);

  // Brand voice
  const [brandVoice, setBrandVoice]       = useState<BrandVoice>({});
  const [savingVoice, setSavingVoice]     = useState(false);
  const [voiceSaved, setVoiceSaved]       = useState(false);

  const loadTemplates = useCallback(async () => {
    const res = await fetch('/api/templates');
    const data = await res.json();
    setTemplates(data.templates ?? []);
  }, []);

  const loadBrandVoice = useCallback(async () => {
    const res = await fetch('/api/brand-voice');
    const data = await res.json();
    setBrandVoice(data.voice ?? {});
  }, []);

  useEffect(() => { loadTemplates(); loadBrandVoice(); }, [loadTemplates, loadBrandVoice]);

  function applyTemplate(t: Template) {
    setType(t.type);
    setPrompt(t.prompt);
    setAudience(t.audience ?? '');
    setUrl(t.url ?? '');
    setGenerated(null);
    setImageUrl(null);
    setScheduled(false);
    setError('');
  }

  async function saveAsTemplate() {
    if (!templateName.trim() || !prompt.trim()) return;
    setSavingTemplate(true);
    try {
      await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: templateName, type, prompt, audience: audience || undefined, url: url || undefined }),
      });
      setTemplateName('');
      setShowSaveTemplate(false);
      await loadTemplates();
    } finally { setSavingTemplate(false); }
  }

  async function deleteTemplate(id: string) {
    await fetch(`/api/templates/${id}`, { method: 'DELETE' });
    await loadTemplates();
  }

  async function saveBrandVoice() {
    setSavingVoice(true);
    try {
      await fetch('/api/brand-voice', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandVoice),
      });
      setVoiceSaved(true);
      setTimeout(() => setVoiceSaved(false), 2000);
    } finally { setSavingVoice(false); }
  }

  function getTimePresets() {
    const now = new Date();
    const slots = [9, 12, 18, 21];
    const presets: { label: string; display: string; value: string }[] = [];

    for (let dayOffset = 0; dayOffset <= 2 && presets.length < 4; dayOffset++) {
      for (const hour of slots) {
        if (presets.length >= 4) break;
        const d = new Date(now);
        d.setDate(d.getDate() + dayOffset);
        d.setHours(hour, 0, 0, 0);
        if (d <= now) continue;
        const label = dayOffset === 0 ? 'Today' : dayOffset === 1 ? 'Tomorrow' : d.toLocaleDateString(undefined, { weekday: 'short' });
        const time = d.toLocaleTimeString(undefined, { hour: 'numeric', hour12: true });
        presets.push({
          label: `${label} ${time}`,
          display: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          value: d.toISOString().slice(0, 16),
        });
      }
    }
    return presets;
  }

  async function handleAutoQueue() {
    if (!generated) return;
    setScheduling(true);
    setError('');
    try {
      const res = await fetch('/api/content/list?status=scheduled');
      const data = await res.json();
      const scheduled: ContentItem[] = data.items ?? [];

      let base = new Date();
      if (scheduled.length > 0) {
        const latest = scheduled.reduce((a: ContentItem, b: ContentItem) =>
          new Date(a.scheduled_at!) > new Date(b.scheduled_at!) ? a : b
        );
        base = new Date(latest.scheduled_at!);
      }

      const next = new Date(base.getTime() + 24 * 60 * 60 * 1000);
      next.setMinutes(0, 0, 0);

      const schedRes = await fetch('/api/content/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_id: generated.id, scheduled_at: next.toISOString() }),
      });
      const schedData = await schedRes.json();
      if (!schedRes.ok) throw new Error(schedData.error);
      setScheduled(true);
      setGenerated(schedData.content);
      setDoneSteps(prev => new Set(prev).add(2));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally { setScheduling(false); }
  }

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setGenerating(true);
    setGenerated(null);
    setImageUrl(null);
    setScheduled(false);
    setError('');
    setImageError('');
    try {
      const res = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, prompt, audience: audience || undefined, url: url || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGenerated(data.content);
      setGenerating(false);
      const d = new Date(Date.now() + 60 * 60 * 1000);
      setScheduleTime(d.toISOString().slice(0, 16));
      setDoneSteps(prev => new Set(prev).add(1));
      setStep(2);

      setGeneratingImg(true);
      const imgRes = await fetch('/api/content/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_id: data.content.id, prompt, type }),
      });
      const imgData = await imgRes.json();
      if (imgData.imageUrl) {
        setImageUrl(imgData.imageUrl);
      } else if (imgData.error) {
        const msg = imgData.error.includes('billing') || imgData.error.includes('quota')
          ? 'Image generation failed — check your OpenAI billing at platform.openai.com.'
          : imgData.error;
        setImageError(msg);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setGenerating(false);
      setGeneratingImg(false);
    }
  }

  async function handleSchedule() {
    if (!generated || !scheduleTime) return;
    setScheduling(true);
    setError('');
    try {
      const res = await fetch('/api/content/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_id: generated.id, scheduled_at: new Date(scheduleTime).toISOString() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setScheduled(true);
      setGenerated(data.content);
      setDoneSteps(prev => new Set(prev).add(2));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally { setScheduling(false); }
  }

  async function loadList() {
    setLoadingList(true);
    try {
      const res = await fetch('/api/content/list');
      const data = await res.json();
      setItems(data.items ?? []);
    } catch { setItems([]); }
    finally { setLoadingList(false); }
  }

  function goToStep(s: Step) {
    setStep(s);
    if (s === 3) loadList();
  }

  function reset() {
    setGenerated(null); setImageUrl(null); setScheduled(false);
    setPrompt(''); setAudience(''); setUrl(''); setError('');
    setDoneSteps(new Set()); setStep(1);
  }

  const showPreview = step === 1 || step === 2;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <span className="font-semibold text-gray-900 text-sm">{brandVoice.brand_name || 'AutoContent'}</span>
      </header>

      {/* Step tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          {STEPS.map(s => {
            const active = step === s.id;
            const done   = doneSteps.has(s.id);
            return (
              <button key={s.id} onClick={() => goToStep(s.id as Step)}
                className={`flex items-center gap-2.5 px-6 py-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${active ? 'border-violet-600 text-violet-700' : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${done ? 'bg-green-500 text-white' : active ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {done ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> : s.id}
                </span>
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="flex" style={{ height: 'calc(100vh - 113px)' }}>

        {/* Left */}
        <div className="flex-1 overflow-y-auto px-10 py-10">
          <div className="max-w-xl space-y-8">

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <>
                {/* Templates */}
                {templates.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Your templates</p>
                    <div className="grid grid-cols-2 gap-3">
                      {templates.map(t => (
                        <div key={t.id} role="button" tabIndex={0} onClick={() => applyTemplate(t)} onKeyDown={e => e.key === 'Enter' && applyTemplate(t)}
                          className="group cursor-pointer text-left border border-gray-200 hover:border-violet-400 bg-white hover:bg-violet-50/40 rounded-xl p-4 transition-all">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs">{TYPE_OPTIONS.find(o => o.value === t.type)?.icon}</span>
                            <button onClick={e => { e.stopPropagation(); deleteTemplate(t.id); }}
                              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                          </div>
                          <p className="text-sm font-medium text-gray-800 mb-1 truncate">{t.name}</p>
                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{t.prompt}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 mt-6" />
                  </div>
                )}

                {/* Form */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content type</label>
                    <select value={type} onChange={e => setType(e.target.value as ContentType)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500">
                      {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Audience <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input type="text" value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. sneaker fans" className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500" />
                  </div>
                </div>

                {type === 'web_push' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Launch URL</label>
                    <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://yoursite.com/page" className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500" />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What do you want to say? <span className="text-red-400">*</span></label>
                  <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g. Flash sale on sneakers — 30% off today only" rows={4} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 resize-none leading-relaxed" />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">Describe it plainly — AI writes the copy and generates an image.</p>
                    {prompt.trim() && (
                      <button onClick={() => setShowSaveTemplate(v => !v)} className="text-xs text-violet-500 hover:text-violet-700 font-medium transition-colors flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>
                        Save as template
                      </button>
                    )}
                  </div>
                </div>

                {showSaveTemplate && (
                  <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-violet-700">Save this prompt as a template</p>
                    <input type="text" value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="Template name, e.g. Weekly sale push" className="w-full border border-violet-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500" />
                    <div className="flex gap-2">
                      <button onClick={saveAsTemplate} disabled={savingTemplate || !templateName.trim()} className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors">
                        {savingTemplate ? 'Saving…' : 'Save template'}
                      </button>
                      <button onClick={() => setShowSaveTemplate(false)} className="text-xs text-gray-500 hover:text-gray-700 px-3 py-2 transition-colors">Cancel</button>
                    </div>
                  </div>
                )}

                {brandVoice.tone && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-500 shrink-0"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 8v4M12 16h.01"/></svg>
                    <p className="text-xs text-gray-500">Brand voice active — <span className="text-gray-700 font-medium">{brandVoice.tone}</span></p>
                    <button onClick={() => goToStep(5)} className="ml-auto text-xs text-violet-500 hover:text-violet-700 transition-colors">Edit</button>
                  </div>
                )}

                {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

                <button onClick={handleGenerate} disabled={generating || !prompt.trim()} className="bg-gray-900 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors flex items-center gap-2">
                  {generating ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>Writing…</> : 'Generate content'}
                </button>
              </>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && generated && (
              <>
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <span className="text-sm font-semibold text-gray-700">{TYPE_OPTIONS.find(t => t.value === generated.type)?.label}</span>
                    <Badge status={generated.status} />
                  </div>
                  <div className="p-6 space-y-5">
                    {generated.type === 'email' ? (
                      <>
                        <div><div className="flex items-center justify-between mb-1.5"><span className="text-xs font-medium text-gray-500">Subject</span><CharCount value={generated.subject ?? ''} max={60} /></div><p className="text-sm font-semibold text-gray-900">{generated.subject}</p></div>
                        <div className="border-t border-gray-100 pt-5"><p className="text-xs font-medium text-gray-500 mb-3">Body</p><div className="text-sm text-gray-700 leading-relaxed [&_p]:mb-3 [&_a]:text-violet-600" dangerouslySetInnerHTML={{ __html: generated.body }} /></div>
                      </>
                    ) : (
                      <>
                        <div><div className="flex items-center justify-between mb-1.5"><span className="text-xs font-medium text-gray-500">Title</span><CharCount value={generated.title ?? ''} max={50} /></div><p className="text-sm font-semibold text-gray-900">{generated.title}</p></div>
                        <div className="border-t border-gray-100 pt-5"><div className="flex items-center justify-between mb-1.5"><span className="text-xs font-medium text-gray-500">Message</span><CharCount value={generated.body} max={100} /></div><p className="text-sm text-gray-700 leading-relaxed">{generated.body}</p></div>
                      </>
                    )}
                    <div className="border-t border-gray-100 pt-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-gray-500">Image <span className="text-gray-400 font-normal">({generated.type === 'email' ? '1080 × 1080' : '1440 × 720'})</span></span>
                        {generatingImg && <span className="text-xs text-violet-500 flex items-center gap-1.5"><svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>Generating…</span>}
                      </div>
                      {imageError && <p className="text-xs text-red-500 mb-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{imageError}</p>}
                      <ImageSlot imageUrl={imageUrl} loading={generatingImg} aspectRatio={generated.type === 'email' ? '1/1' : '16/9'} />
                    </div>
                  </div>
                </div>

                {!scheduled ? (
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">When to send</label>

                      {/* Auto-queue */}
                      <button onClick={handleAutoQueue} disabled={scheduling} className="w-full mb-4 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white rounded-xl px-5 py-3.5 text-sm font-medium flex items-center gap-3 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        <div className="text-left">
                          <p className="font-semibold">Add to queue</p>
                          <p className="text-violet-200 text-xs font-normal">Slots in 24 h after your last scheduled item</p>
                        </div>
                      </button>

                      {/* Quick presets */}
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Or pick a time</p>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {getTimePresets().map(p => (
                          <button key={p.label} onClick={() => setScheduleTime(p.value)}
                            className={`border rounded-xl px-4 py-2.5 text-sm text-left transition-colors ${scheduleTime === p.value ? 'border-violet-500 bg-violet-50 text-violet-700 font-medium' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                            <p className="font-medium">{p.label}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{p.display}</p>
                          </button>
                        ))}
                      </div>

                      {/* Custom */}
                      <details className="group">
                        <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 list-none flex items-center gap-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-open:rotate-90 transition-transform"><path d="M9 18l6-6-6-6"/></svg>
                          Custom date & time
                        </summary>
                        <input type="datetime-local" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500" />
                      </details>
                    </div>

                    {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

                    <div className="flex gap-3">
                      <button onClick={handleSchedule} disabled={scheduling || !scheduleTime} className="bg-gray-900 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors">{scheduling ? 'Scheduling…' : 'Schedule'}</button>
                      <button onClick={reset} className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium px-5 py-3 rounded-xl text-sm transition-colors">Start over</button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-5 flex items-center justify-between">
                    <div><p className="text-sm font-semibold text-green-800">Scheduled successfully</p><p className="text-xs text-green-600 mt-0.5">Sends {new Date(generated.scheduled_at!).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}</p></div>
                    <button onClick={() => goToStep(3)} className="text-sm text-green-700 font-medium hover:text-green-900 ml-6 transition-colors">View all →</button>
                  </div>
                )}
              </>
            )}

            {step === 2 && !generated && (
              <div className="text-center py-20"><p className="text-gray-400 text-sm mb-4">No content generated yet.</p><button onClick={() => goToStep(1)} className="text-sm text-violet-600 font-medium hover:underline">← Go back and generate</button></div>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                  <button onClick={loadList} className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>Refresh</button>
                </div>
                {loadingList ? <div className="flex justify-center py-20"><svg className="animate-spin w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg></div>
                : items.length === 0 ? <div className="text-center py-20 space-y-3"><p className="text-gray-400 text-sm">Nothing here yet.</p><button onClick={() => goToStep(1)} className="text-sm text-violet-600 font-medium hover:underline">Create your first piece →</button></div>
                : <div className="space-y-3">{items.map(item => (
                    <div key={item.id} className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl px-6 py-5 transition-colors">
                      <div className="flex items-start justify-between mb-3"><span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{TYPE_OPTIONS.find(t => t.value === item.type)?.label}</span><Badge status={item.status} /></div>
                      <p className="text-sm font-semibold text-gray-900 mb-1.5">{item.title ?? item.subject ?? 'Email'}</p>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{item.body.replace(/<[^>]+>/g, '').slice(0, 120)}{item.body.replace(/<[^>]+>/g, '').length > 120 ? '…' : ''}</p>
                      {(item.metadata as Record<string, string> | undefined)?.imageUrl && <img src={(item.metadata as Record<string, string>).imageUrl} alt="" className="w-full mt-3 rounded-xl object-cover" style={{ aspectRatio: item.type === 'email' ? '1/1' : '16/9', maxHeight: 160 }} />}
                      <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">{item.status === 'scheduled' && item.scheduled_at ? `Scheduled: ${new Date(item.scheduled_at).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}` : item.status === 'sent' && item.sent_at ? `Sent: ${new Date(item.sent_at).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}` : `Created: ${new Date(item.created_at).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}`}</p>
                    </div>
                  ))}</div>}
              </>
            )}

            {/* ── STEP 4 ── */}
            {step === 4 && (
              <div className="space-y-4 max-w-lg">
                <p className="text-sm text-gray-500 leading-relaxed">Every hour Vercel triggers the cron job. It checks for scheduled items past their send time, dispatches them, then marks them sent.</p>
                {[
                  { label: 'Cron fires at the top of every hour',              note: 'vercel.json', color: 'bg-blue-400' },
                  { label: 'Authorization checked against CRON_SECRET',        note: 'security',    color: 'bg-blue-400' },
                  { label: 'Fetches all scheduled items past their send time', note: '',             color: 'bg-blue-400' },
                  { label: 'Emails sent via Resend',                           note: 'active',       color: 'bg-green-400' },
                  { label: 'Push / web push sent via OneSignal',               note: 'coming soon',  color: 'bg-amber-400' },
                  { label: 'Status updated to sent, error logged on failure',  note: '',             color: 'bg-green-400' },
                ].map((row, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${row.color} shrink-0`} />
                    <p className="text-sm text-gray-700 flex-1">{row.label}</p>
                    {row.note && <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">{row.note}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* ── STEP 5: Settings ── */}
            {step === 5 && (
              <div className="space-y-10">

                {/* Brand voice */}
                <div>
                  <h2 className="text-base font-semibold text-gray-900 mb-1">Brand voice</h2>
                  <p className="text-sm text-gray-500 mb-6">These settings are silently injected into every generation prompt. The AI will always write in your voice.</p>
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Brand name</label>
                        <input type="text" value={brandVoice.brand_name ?? ''} onChange={e => setBrandVoice(v => ({ ...v, brand_name: e.target.value }))} placeholder="e.g. Kicks & Co." className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                        <input type="text" value={brandVoice.tone ?? ''} onChange={e => setBrandVoice(v => ({ ...v, tone: e.target.value }))} placeholder="e.g. friendly, energetic, casual" className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Keywords to use</label>
                      <input type="text" value={brandVoice.keywords ?? ''} onChange={e => setBrandVoice(v => ({ ...v, keywords: e.target.value }))} placeholder="e.g. drops, exclusive, heat, limited" className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Always avoid</label>
                      <input type="text" value={brandVoice.avoid ?? ''} onChange={e => setBrandVoice(v => ({ ...v, avoid: e.target.value }))} placeholder="e.g. jargon, all caps, exclamation marks" className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500" />
                    </div>
                    <button onClick={saveBrandVoice} disabled={savingVoice} className="bg-gray-900 hover:bg-gray-700 disabled:opacity-40 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors flex items-center gap-2">
                      {voiceSaved ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>Saved</> : savingVoice ? 'Saving…' : 'Save brand voice'}
                    </button>
                  </div>
                </div>

                {/* Templates */}
                <div>
                  <h2 className="text-base font-semibold text-gray-900 mb-1">Saved templates</h2>
                  <p className="text-sm text-gray-500 mb-6">Reusable prompts. Click any template on the Generate tab to pre-fill the form instantly.</p>
                  {templates.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-300 rounded-2xl px-6 py-10 text-center">
                      <p className="text-sm text-gray-400 mb-2">No templates saved yet.</p>
                      <p className="text-xs text-gray-400">Write a prompt on the Generate tab and click <span className="font-medium text-gray-600">Save as template</span>.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {templates.map(t => (
                        <div key={t.id} className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-start gap-4">
                          <span className="text-xl mt-0.5">{TYPE_OPTIONS.find(o => o.value === t.type)?.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 mb-1">{t.name}</p>
                            <p className="text-sm text-gray-500 leading-relaxed">{t.prompt}</p>
                            {t.audience && <p className="text-xs text-gray-400 mt-1.5">Audience: {t.audience}</p>}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => { applyTemplate(t); goToStep(1); }} className="text-xs text-violet-600 hover:text-violet-800 font-medium border border-violet-200 hover:bg-violet-50 px-3 py-1.5 rounded-lg transition-colors">Use</button>
                            <button onClick={() => deleteTemplate(t.id)} className="text-xs text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right — preview */}
        {showPreview && (
          <div className="w-[420px] shrink-0 border-l border-gray-200 bg-gray-50 flex flex-col items-center justify-start py-10 px-8 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">Preview</p>
            {type === 'push' && <PhonePreview empty={!generated} title={generated?.title} body={generated?.body} imageUrl={imageUrl} imageLoading={generatingImg} brandName={brandVoice.brand_name} />}
            {type === 'web_push' && <BrowserPreview empty={!generated} title={generated?.title} body={generated?.body} url={url} imageUrl={imageUrl} imageLoading={generatingImg} brandName={brandVoice.brand_name} />}
            {type === 'email' && <EmailPreview empty={!generated} subject={generated?.subject} body={generated?.body} imageUrl={imageUrl} imageLoading={generatingImg} brandName={brandVoice.brand_name} />}
            {!generated && <p className="text-xs text-gray-400 text-center mt-6">Preview updates after you generate</p>}
          </div>
        )}
      </div>
    </div>
  );
}
