# DesignMate AI — MVP сервиса AI + Human дизайна

MVP веб-сервиса для российского рынка: пользователь выбирает дизайн-услугу, заполняет бриф, загружает референсы, оплачивает заказ через ЮKassa, а оператор получает структурированный промт, управляет статусом и загружает результаты.

## Стек

- Next.js App Router + TypeScript + React
- Tailwind CSS
- PostgreSQL + Prisma ORM
- NextAuth/Auth.js credentials auth
- Zod validation
- Локальное файловое хранилище `/public/uploads/orders/{orderId}` через storage abstraction
- YooKassa API в sandbox/test-ready режиме

## Быстрый старт

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Приложение будет доступно на `http://localhost:3000`.

## Переменные окружения

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_human_design?schema=public"
NEXTAUTH_SECRET="change-me"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
YOOKASSA_SHOP_ID=""
YOOKASSA_SECRET_KEY=""
YOOKASSA_RETURN_URL="http://localhost:3000/payment/success"
YOOKASSA_WEBHOOK_SECRET=""
```

Секреты ЮKassa используются только на сервере. `NEXT_PUBLIC_APP_URL` нужен для ссылок возврата и публичного адреса приложения.

## Prisma

Создать миграцию и применить схему:

```bash
npx prisma migrate dev --name init
```

Сгенерировать клиент:

```bash
npx prisma generate
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

Также создаётся администратор:

- email: `admin@example.com`
- пароль: `Admin12345!`

## Как создать admin user вручную

Самый простой путь — изменить email/пароль в `prisma/seed.ts` и повторно выполнить:

```bash
npx prisma db seed
```

В рабочем окружении рекомендуется создать отдельный защищённый скрипт или вручную обновить роль пользователя в БД на `ADMIN`.

## Настройка YooKassa sandbox

1. Создайте тестовый магазин в кабинете ЮKassa.
2. Скопируйте `shopId` и секретный ключ в `.env`:
   - `YOOKASSA_SHOP_ID`
   - `YOOKASSA_SECRET_KEY`
3. Укажите URL возврата: `http://localhost:3000/payment/success`.
4. Для локальных webhook используйте туннель, например ngrok, и настройте endpoint:
   - `POST https://<your-tunnel>/api/webhooks/yookassa`
5. В MVP webhook принимает события `payment.succeeded`, `payment.canceled`, `refund.succeeded` и записывает raw payload в `PaymentEvent`.

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
- `src/lib/storage.ts` изолирует локальное сохранение файлов, чтобы позже заменить его на S3-compatible storage.
- `src/lib/yookassa.ts` содержит серверные вызовы YooKassa с Basic Auth и Idempotence-Key.
- `prisma/schema.prisma` описывает пользователей, услуги, заказы, файлы, результаты, платежи, события платежей и аддоны.

## Ограничения MVP

- UI аккуратный и расширяемый, но без финального visual polish.
- Файлы хранятся локально в `public/uploads`.
- Возвраты заложены через структуру статусов и webhook-событие `refund.succeeded`, но полноценный флоу возврата не реализован.
