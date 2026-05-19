# Emotional Ping

A private, emotion-first communication platform for couples.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Telegram Bot API webhook
- Web Audio API with local file uploads

## Local Setup

1. Install dependencies:
   ```bash
   npm.cmd install
   ```

2. Configure environment:
   ```bash
   copy .env.example .env.local
   ```

3. Set `DATABASE_URL` in `.env.local` to a PostgreSQL database, then create the schema:
   ```bash
   npm.cmd run db:generate
   npm.cmd run db:push
   ```

4. Start the app:
   ```bash
   npm.cmd run dev
   ```

5. Open:
   ```text
   http://127.0.0.1:3000
   ```

## Telegram Webhook

Users connect Telegram from the dashboard through:

```text
https://t.me/<bot>?start=<userId>
```

Set the webhook to your deployed Next.js API route:

```bash
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook?url=https://YOUR_DOMAIN.com/api/telegram/webhook&secret_token=$TELEGRAM_WEBHOOK_SECRET"
```

## Production Database

The app uses Prisma with PostgreSQL. Set `DATABASE_URL` to a hosted Postgres connection string in your deployment provider, then run:

```bash
npm.cmd run db:push
```

For Vercel, add these environment variables in Project Settings:

```text
DATABASE_URL
SESSION_SECRET
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME
TELEGRAM_BOT_TOKEN
TELEGRAM_WEBHOOK_SECRET
```

## Audio Uploads

The current audio endpoint writes uploaded recordings to local disk. This is fine for local development, but serverless platforms such as Vercel do not provide durable local file storage. Use Vercel Blob, S3, Supabase Storage, or Cloudinary before relying on audio uploads in production.
