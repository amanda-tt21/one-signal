# CLAUDE.md — Content Automation System

## What this project does
This system helps me create and send content automatically. I describe what I want, and Claude writes it for me. The content gets saved, sent at the right time, and delivered to my audience. No manual work needed.

## The three types of content I send
1. **Push notifications** — short alerts that pop up on someone's phone
2. **Web push notifications** — same thing but on a browser/desktop
3. **Email newsletters** — longer messages sent to an email list

## Tools connected to this project
- **Vercel** — where the project lives and runs
- **Supabase** — where all content and schedules are saved
- **GitHub** — keeps track of all changes
- **OneSignal** — will be connected later to help send notifications

---

## How the database should be set up (Supabase)

Create two simple tables to store everything:

```sql
create table content_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('push', 'web_push', 'email')),
  title text,
  body text not null,
  subject text,
  audience text,
  status text default 'draft' check (status in ('draft', 'scheduled', 'sent', 'failed')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  metadata jsonb,
  created_at timestamptz default now()
);

create table send_log (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references content_items(id),
  channel text,
  provider text,
  provider_id text,
  status text,
  error text,
  sent_at timestamptz default now()
);
```

---

## Rules for writing each type of content

### Phone / browser pop-up alerts (push & web push)
- Title: short, max 50 characters, should make people want to tap
- Message: max 100 characters, get to the point fast
- For web push, also include a link for where to send people when they tap

### Email newsletter
- Subject line: max 60 characters, honest and clear
- Body: intro → main content → one clear call to action
- Always include a way for people to unsubscribe

---

## How scheduling works

- All content is saved with a date and time for when it should go out
- Every hour, the system checks if anything is due to be sent
- It only sends content that has been marked as "scheduled"
- After sending, it marks the content as "sent" and logs it

---

## How the project folders should be organized

```
/app
  /api
    /content
      generate/route.ts      ← where content gets written by AI
      schedule/route.ts      ← where I set send times
      list/route.ts          ← where I see all my content
    /cron
      send-scheduled/route.ts ← the automatic hourly sender
/lib
  /supabase
    client.ts
    queries.ts
  /content
    generator.ts             ← AI writing logic
    scheduler.ts             ← timing logic
  /providers
    onesignal.ts             ← OneSignal (not active yet)
    resend.ts                ← email sender
/types
  content.ts
```

---

## OneSignal — coming soon

OneSignal is not set up yet. Leave a placeholder so it is easy to connect later:

```ts
// lib/providers/onesignal.ts
export async function sendPushViaOneSignal(payload: {
  title: string;
  body: string;
  url?: string;
  audience?: string;
}) {
  // OneSignal will go here once connected
  throw new Error('OneSignal not yet configured');
}
```

Two things will be needed when the time comes:
```
ONESIGNAL_APP_ID=
ONESIGNAL_API_KEY=
```

---

## Secret keys needed to make everything work

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
RESEND_API_KEY=
ONESIGNAL_APP_ID=        ← fill in when ready
ONESIGNAL_API_KEY=       ← fill in when ready
CRON_SECRET=
```

---

## General instructions for Claude Code

- If something is not connected yet, leave a clear note instead of breaking things
- Always keep the content writing and the sending parts separate
- When I ask for content, save it as a draft first — do not send anything until I say so
- If you are unsure about something, ask me in plain English before building it
