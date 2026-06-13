# DesignMate AI — MVP сервиса AI + Human дизайна

MVP веб-сервиса для российского рынка: пользователь выбирает дизайн-услугу, заполняет бриф, загружает референсы, оплачивает заказ через ЮKassa, а оператор получает структурированный промт, управляет статусом и загружает результаты.

## Стек

- Next.js App Router + TypeScript + React
- Tailwind CSS
- PostgreSQL + Prisma ORM
- NextAuth/Auth.js credentials auth
- Zod validation
- Приватное файловое хранилище с двумя режимами:
  - `local` для разработки (`.data/uploads/orders/{orderId}`);
  - `s3` для production через S3-compatible object storage.
- Защищённая выдача файлов через backend route `GET /api/files/[id]` с проверкой владельца заказа или staff-роли
- YooKassa API в sandbox/test-ready и production-ready режимах

## Быстрый старт для local development

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Приложение будет доступно на `http://localhost:3000`.

Для локальной разработки оставьте `STORAGE_DRIVER="local"`. Загруженные файлы будут храниться вне публичной директории в `.data/uploads` и выдаваться только через защищённый backend route.

## Переменные окружения

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_human_design?schema=public"
NEXTAUTH_SECRET="change-me"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Storage: local for development, s3 for production-compatible object storage.
STORAGE_DRIVER="local"
STORAGE_LOCAL_ROOT=".data/uploads"
S3_ENDPOINT=""
S3_REGION=""
S3_BUCKET=""
S3_ACCESS_KEY_ID=""
S3_SECRET_ACCESS_KEY=""
S3_FORCE_PATH_STYLE="false"
S3_PREFIX=""

YOOKASSA_SHOP_ID=""
YOOKASSA_SECRET_KEY=""
YOOKASSA_RETURN_URL="http://localhost:3000/payment/success"
YOOKASSA_WEBHOOK_SECRET=""
```

Никогда не коммитьте реальные значения `NEXTAUTH_SECRET`, `S3_SECRET_ACCESS_KEY`, `YOOKASSA_SECRET_KEY`, пароли БД и другие секреты.

### Storage

`src/lib/storage.ts` выбирает adapter по `STORAGE_DRIVER`:

- `local` — режим по умолчанию для разработки. Файлы сохраняются в `STORAGE_LOCAL_ROOT` или `.data/uploads`, если переменная не задана.
- `s3` — production-режим для S3-compatible storage. Приложение сохраняет приватные объекты через AWS Signature Version 4 и читает их только с сервера после проверки прав доступа в `GET /api/files/[id]`.

Для S3-compatible storage задайте:

- `STORAGE_DRIVER="s3"`
- `S3_ENDPOINT` — endpoint провайдера, например `https://s3.amazonaws.com`, `https://storage.yandexcloud.net` или endpoint Selectel/MinIO;
- `S3_REGION` — регион, который требует провайдер;
- `S3_BUCKET` — bucket/container для приватных файлов;
- `S3_ACCESS_KEY_ID` и `S3_SECRET_ACCESS_KEY` — сервисный ключ с правами read/write только на нужный bucket;
- `S3_FORCE_PATH_STYLE="true"` — включите для MinIO и провайдеров, которым нужен path-style URL;
- `S3_PREFIX` — опциональный префикс, например `prod/`, если один bucket используется для нескольких окружений.

Bucket должен быть приватным. Не включайте public-read policy: пользователи получают файлы через `/api/files/[id]`, где приложение проверяет сессию, владельца заказа и staff-роли.

### Managed PostgreSQL

Для production используйте managed PostgreSQL у хостинга или отдельного провайдера. В `DATABASE_URL` укажите строку подключения production-БД, например:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public&sslmode=require"
```

Требования:

- включён SSL, если его требует провайдер;
- пользователь БД имеет права на миграции Prisma;
- production и staging используют разные базы и разные storage prefixes/buckets.

### YooKassa sandbox и production

- Для sandbox используйте тестовый магазин, тестовый `YOOKASSA_SHOP_ID`, тестовый `YOOKASSA_SECRET_KEY` и URL возврата на локальное/staging окружение.
- Для production используйте боевой магазин ЮKassa и production secret key.
- `YOOKASSA_RETURN_URL` должен вести на `/payment/success` вашего публичного домена.
- Если `YOOKASSA_WEBHOOK_SECRET` задан, webhook принимает только запросы с таким значением в `x-webhook-secret` или `Authorization: Bearer ...`.
- Endpoint webhook: `POST https://<your-domain>/api/webhooks/yookassa`.

## Prisma

Создать миграцию и применить схему локально:

```bash
npx prisma migrate dev --name init
```

Сгенерировать клиент:

```bash
npx prisma generate
```

Применить миграции в production/staging:

```bash
npx prisma migrate deploy
```

Заполнить seed-данные:

```bash
npx prisma db seed
```

Seed создаёт 4 услуги:

- `marketplace-cards`
- `vk-design`
- `logos`
- `banners`

Также создаётся администратор для разработки:

- email: `admin@example.com`
- пароль: `Admin12345!`

## Production admin user

Для production не используйте публичный demo-пароль из README. Рекомендуемый порядок:

1. Создайте пользователя через `/auth/sign-up` с рабочим email и сильным паролем.
2. Подключитесь к production-БД защищённым способом.
3. Обновите роль пользователя на `ADMIN`:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@your-domain.example';
```

Альтернатива — временно изменить email/пароль в `prisma/seed.ts`, выполнить seed на production один раз и сразу удалить/заменить временные значения в рабочем процессе. Не храните production-пароли в git.

## Настройка YooKassa sandbox

1. Создайте тестовый магазин в кабинете ЮKassa.
2. Скопируйте `shopId` и секретный ключ в `.env`:
   - `YOOKASSA_SHOP_ID`
   - `YOOKASSA_SECRET_KEY`
3. Укажите URL возврата: `http://localhost:3000/payment/success`.
4. Для локальных webhook используйте туннель, например ngrok, и настройте endpoint:
   - `POST https://<your-tunnel>/api/webhooks/yookassa`
5. В MVP webhook принимает события `payment.succeeded`, `payment.canceled`, `refund.succeeded`, записывает raw payload в `PaymentEvent`, проверяет shared secret при его наличии и перед зачислением оплаты повторно получает платёж из YooKassa.

## Production deployment

Краткий checklist:

1. Подключите GitHub repository к hosting provider.
2. Создайте managed PostgreSQL и задайте production `DATABASE_URL`.
3. Создайте приватный S3-compatible bucket и задайте `STORAGE_DRIVER="s3"` + все `S3_*` переменные.
4. Задайте NextAuth и app URL переменные: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`.
5. Задайте production-переменные YooKassa и webhook secret.
6. На release/deploy выполните `npm install`, `npm run prisma:generate`, `npx prisma migrate deploy`, `npm run build`.
7. Создайте или назначьте production admin user.
8. Настройте YooKassa webhook на публичный endpoint.
9. Проверьте тестовый заказ, оплату, webhook и скачивание файла из личного кабинета.

Подробный runbook находится в [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## Как тестировать оплату

1. Зарегистрируйтесь или войдите.
2. Откройте `/services` и выберите услугу.
3. Заполните бриф на `/order/new/[serviceSlug]`.
4. На странице заказа нажмите «Оплатить через ЮKassa».
5. После оплаты ЮKassa вернёт пользователя на `/payment/success`.
6. Webhook обновит `Payment.status`, `Order.paymentStatus` и переведёт заказ в работу.
7. Если webhook недоступен локально, администратор может вызвать `POST /api/payments/yookassa/check-status` с `providerPaymentId` для ручной синхронизации.

## Основные маршруты

### Public

- `/`
- `/services`
- `/services/marketplace-cards`
- `/services/vk-design`
- `/services/logos`
- `/services/banners`
- `/auth/sign-in`
- `/auth/sign-up`

### Личный кабинет

- `/dashboard`
- `/dashboard/orders`
- `/dashboard/orders/[id]`
- `/dashboard/balance`
- `/dashboard/profile`

### Заказ и платежи

- `/order/new/[serviceSlug]`
- `/payment/success`
- `/payment/fail`
- `POST /api/payments/yookassa/create`
- `POST /api/webhooks/yookassa`
- `GET /api/files/[id]`
- `POST /api/payments/yookassa/check-status`

### Админка

- `/admin`
- `/admin/orders`
- `/admin/orders/[id]`
- `/admin/services`
- `/admin/users`
- `/admin/payments`

## Архитектура MVP

- `src/lib/prompt-engine.ts` формирует русский структурированный промт для оператора/ИИ.
- `src/lib/storage.ts` содержит local и S3-compatible storage adapters. В обоих режимах в БД сохраняется приватный storage key, а наружу отдаётся только защищённая ссылка `/api/files/[id]`.
- `src/lib/yookassa.ts` содержит серверные вызовы YooKassa с Basic Auth и Idempotence-Key.
- `prisma/schema.prisma` описывает пользователей, услуги, заказы, файлы, результаты, платежи, события платежей и аддоны.

## Ограничения MVP

- UI аккуратный и расширяемый, но без финального visual polish.
- Загруженные пользователем файлы не являются публичными и должны оставаться в приватном local/S3 хранилище.
- Возвраты заложены через структуру статусов и webhook-событие `refund.succeeded`, но полноценный флоу возврата не реализован.

## CI

GitHub Actions workflow `.github/workflows/ci.yml` запускает `npm install`, `npm run prisma:generate`, `npm run lint` и `npm run build` на pull request.
