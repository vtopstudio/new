# DesignPilot — MVP AI + Human дизайна

MVP веб-сервиса для российского рынка: клиент выбирает дизайн-услугу, заполняет бриф, оплачивает заказ через ЮKassa, а оператор получает структурированный prompt и загружает готовые результаты.

## Стек

- Next.js App Router + TypeScript
- Tailwind CSS
- Prisma ORM + PostgreSQL
- Cookie/JWT auth с ролями `USER`, `ADMIN`, `OPERATOR`
- Zod validation
- Локальное файловое хранилище `/public/uploads/orders/{orderId}` через storage abstraction
- YooKassa API в sandbox/test-ready режиме

## Установка

```bash
npm install
cp .env.example .env
```

Заполните `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_design_mvp?schema=public"
AUTH_SECRET="replace-with-long-random-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
YOOKASSA_SHOP_ID=""
YOOKASSA_SECRET_KEY=""
YOOKASSA_RETURN_URL="http://localhost:3000/payment/success"
YOOKASSA_WEBHOOK_SECRET=""
```

## База данных и seed

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

Seed создаёт 4 услуги: `marketplace-cards`, `vk-design`, `logos`, `banners`, а также пользователей:

- admin@example.com / admin12345
- operator@example.com / operator12345

## Запуск

```bash
npm run dev
```

Откройте http://localhost:3000.

## YooKassa sandbox

1. Создайте тестовый магазин в кабинете ЮKassa.
2. Укажите `YOOKASSA_SHOP_ID` и `YOOKASSA_SECRET_KEY` в `.env`.
3. Укажите `YOOKASSA_RETURN_URL=http://localhost:3000/payment/success`.
4. Для локального webhook используйте tunnel (например, ngrok) и настройте URL `POST /api/webhooks/yookassa`.

### Как тестировать оплату

1. Зарегистрируйтесь как пользователь.
2. Создайте заказ через `/services`.
3. На странице заказа нажмите «Оплатить через ЮKassa».
4. После успешного тестового платежа webhook `payment.succeeded` переведёт Payment в `PAID`, Order в `IN_PROGRESS` и сохранит событие в `PaymentEvent`.
5. Если webhook не дошёл, админ может вызвать `POST /api/payments/yookassa/check-status` с `providerPaymentId`.

## Основные маршруты

- Public: `/`, `/services`, `/services/[slug]`, `/auth/sign-in`, `/auth/sign-up`
- Кабинет: `/dashboard`, `/dashboard/orders`, `/dashboard/orders/[id]`, `/dashboard/balance`, `/dashboard/profile`
- Заказ: `/order/new/[serviceSlug]`
- Оплата: `/payment/success`, `/payment/fail`
- Админка: `/admin`, `/admin/orders`, `/admin/orders/[id]`, `/admin/services`, `/admin/users`, `/admin/payments`

## Создание admin user

Самый простой способ — выполнить seed. Для ручного создания используйте Prisma Studio или SQL и сохраните bcrypt hash в поле `passwordHash` с ролью `ADMIN`.

## Архитектура MVP

- `src/lib/prompt-engine.ts` формирует русский структурированный prompt для оператора и внешних AI-инструментов.
- `src/lib/storage.ts` валидирует MIME/размер и сохраняет файлы локально; модуль можно заменить на S3-compatible storage.
- `src/lib/yookassa.ts` изолирует создание платежа, проверку статуса и применение статусов провайдера.
- Server-side checks ограничивают доступ к заказам: пользователь видит только свои заказы, админ/оператор — все.
