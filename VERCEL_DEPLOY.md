# Vercel Deployment

## Required Vercel Environment Variables

Set these in Vercel Project Settings > Environment Variables:

```text
DATABASE_URL
SESSION_SECRET
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME
TELEGRAM_BOT_TOKEN
TELEGRAM_WEBHOOK_SECRET
```

`DATABASE_URL` must be a PostgreSQL connection string. SQLite database files do not persist on Vercel.

## Database Setup

After setting `DATABASE_URL`, push the Prisma schema to the database:

```bash
npm.cmd run db:push
```

If you run this from your machine against production, temporarily set `DATABASE_URL` in your shell to the production Postgres URL first.

## Deploy

```bash
npx vercel
npx vercel --prod
```

## Telegram Webhook

After the production deployment has a stable URL, set the Telegram webhook:

```bash
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook?url=https://YOUR_DOMAIN.com/api/telegram/webhook&secret_token=$TELEGRAM_WEBHOOK_SECRET"
```

## Audio Uploads

Audio uploads currently write files to local disk. This works locally, but is not durable on Vercel. Use Vercel Blob, S3, Supabase Storage, or Cloudinary before depending on audio recordings in production.
