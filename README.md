# VTop AI Design MVP

Первый MVP сервиса **AI + Human Design**: клиент выбирает дизайн-услугу, заполняет бриф на русском языке, система генерирует промпт/ТЗ, принимает оплату через YooKassa и передаёт заказ администратору для ручной проверки и публикации результата.

## Стек

- Next.js App Router + TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- NextAuth Credentials
- YooKassa Payments API + webhook

## Возможности MVP

- Регистрация и вход по email/паролю.
- Личный кабинет клиента: список заказов, статус, промпт, результаты, файлы, баланс.
- Каталог услуг и динамические формы брифа из `fieldsConfig`.
- Prompt engine: сборка production-промпта из шаблона услуги и данных клиента.
- YooKassa: создание redirect-платежа, запись idempotence key, проверка статуса, webhook обработки `succeeded`/`canceled`.
- Админ-панель: заказы, пользователи, платежи, услуги, изменение статуса и публикация результатов.
- Seed-данные: администратор, тестовый клиент, 3 услуги и демо-заказ.

## Быстрый старт

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

Приложение будет доступно на `http://localhost:3000`.

## PostgreSQL

Пример локального запуска PostgreSQL через Docker:

```bash
docker run --name ai-design-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ai_design_mvp -p 5432:5432 -d postgres:16
```

`DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_design_mvp?schema=public"
```

## Переменные окружения

Скопируйте `.env.example` в `.env` и заполните значения:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_design_mvp?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-me-long-random-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
YOOKASSA_SHOP_ID=""
YOOKASSA_SECRET_KEY=""
YOOKASSA_RETURN_URL="http://localhost:3000/payment/success"
YOOKASSA_WEBHOOK_SECRET=""
```

`YOOKASSA_WEBHOOK_SECRET` опционален для MVP. Если он задан, endpoint `/api/webhooks/yookassa` проверяет HMAC SHA-256 в заголовке `x-yookassa-signature`.

## Тестовые пользователи после seed

- Администратор: `admin@vtop.studio` / `admin123`
- Клиент: `client@example.com` / `client123`

## Основные маршруты

- `/` — лендинг.
- `/services` — каталог услуг.
- `/order/new/[serviceSlug]` — создание заказа.
- `/dashboard` — кабинет клиента.
- `/dashboard/orders/[id]` — карточка заказа и оплата YooKassa.
- `/admin` — админ-панель.
- `/api/payments/yookassa/create` — создание платежа.
- `/api/payments/yookassa/check-status` — ручная проверка статуса платежа.
- `/api/webhooks/yookassa` — webhook YooKassa.

## Дальнейшие шаги после MVP

1. Подключить реальную загрузку файлов в S3-совместимое хранилище.
2. Добавить редактор услуг в админке.
3. Добавить email/telegram уведомления о смене статуса.
4. Расширить prompt engine версиями промптов и журналом правок.
5. Добавить интеграцию с AI image API для автоматической генерации черновиков.
