# Emotional Ping

A private, emotion-first communication platform for couples.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- Prisma ORM
- SQLite for local development
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

3. Create the local database:
   ```bash
   npm.cmd run db:generate
   npm.cmd run db:init
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

The app currently uses Prisma with SQLite for local development. For production, switch `prisma/schema.prisma` to PostgreSQL and update `DATABASE_URL`, then create a migration with Prisma.

For local SQLite, `DATABASE_URL` should point to the database file relative to `prisma/schema.prisma`, for example `file:./emotional-ping.db`.
