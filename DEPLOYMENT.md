# Production deployment runbook

Этот документ описывает базовый production/staging деплой DesignMate AI MVP после merge в `main`.

## 1. Подключить GitHub repository к хостингу

1. Создайте новый project/service в выбранном hosting provider.
2. Подключите GitHub repository `vtopstudio/new`.
3. Выберите branch для деплоя: `main` для production, отдельную staging-ветку или preview deployments для staging.
4. Укажите build settings:
   - install command: `npm install`;
   - build command: `npm run build`;
   - start command: `npm run start`, если хостинг требует отдельную start-команду.
5. Используйте Node.js 22, как в CI.

## 2. Подключить managed PostgreSQL

1. Создайте managed PostgreSQL database.
2. Включите SSL, если он требуется провайдером.
3. Создайте отдельного database user для приложения.
4. Сохраните connection string в переменной окружения `DATABASE_URL`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public&sslmode=require"
```

Рекомендуется использовать отдельные базы для production, staging и local development.

## 3. Подключить S3-compatible storage

1. Создайте приватный bucket/container у S3-compatible провайдера.
2. Создайте access key с минимальными правами read/write только на этот bucket.
3. Не включайте public-read policy: файлы должны отдаваться через backend route `GET /api/files/[id]`.
4. Добавьте переменные окружения:

```env
STORAGE_DRIVER="s3"
S3_ENDPOINT="https://storage-provider.example"
S3_REGION="ru-1"
S3_BUCKET="designmate-production-files"
S3_ACCESS_KEY_ID="replace-with-access-key"
S3_SECRET_ACCESS_KEY="replace-with-secret-key"
S3_FORCE_PATH_STYLE="false"
S3_PREFIX="prod/"
```

Для MinIO и части S3-compatible провайдеров установите `S3_FORCE_PATH_STYLE="true"`.

## 4. Добавить env variables в панели хостинга

Минимальный набор production-переменных:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public&sslmode=require"
NEXTAUTH_SECRET="generate-a-long-random-secret"
NEXTAUTH_URL="https://your-domain.example"
NEXT_PUBLIC_APP_URL="https://your-domain.example"
STORAGE_DRIVER="s3"
S3_ENDPOINT="https://storage-provider.example"
S3_REGION="ru-1"
S3_BUCKET="designmate-production-files"
S3_ACCESS_KEY_ID="replace-with-access-key"
S3_SECRET_ACCESS_KEY="replace-with-secret-key"
S3_FORCE_PATH_STYLE="false"
S3_PREFIX="prod/"
YOOKASSA_SHOP_ID="replace-with-production-shop-id"
YOOKASSA_SECRET_KEY="replace-with-production-secret-key"
YOOKASSA_RETURN_URL="https://your-domain.example/payment/success"
YOOKASSA_WEBHOOK_SECRET="generate-a-long-random-webhook-secret"
```

Секреты должны храниться только в secret/env manager хостинга. Не добавляйте реальные значения в `.env.example`, README, issue comments или git history.

## 5. Prisma generate и миграции

CI и production build запускают `prisma generate` через `npm run build`, но для release pipeline удобно выполнять шаги явно:

```bash
npm install
npm run prisma:generate
npx prisma migrate deploy
npm run build
```

`prisma migrate deploy` применяет уже созданные миграции и подходит для production. Не используйте `prisma migrate dev` на production-БД.

## 6. Seed/admin user

Для первичного наполнения услугами выполните:

```bash
npx prisma db seed
```

Seed создаёт demo-admin `admin@example.com` / `Admin12345!`, что удобно для local development, но небезопасно для production. Для production используйте один из вариантов:

1. Создайте пользователя через `/auth/sign-up`, затем назначьте роль в БД:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@your-domain.example';
```

2. Или временно измените seed на production email/пароль, выполните seed один раз и не коммитьте реальные credentials.

После создания production admin проверьте вход в `/admin` и замените любые временные пароли.

## 7. Настроить YooKassa webhook

1. В кабинете ЮKassa укажите production return URL:
   - `https://your-domain.example/payment/success`
2. Добавьте webhook endpoint:
   - `POST https://your-domain.example/api/webhooks/yookassa`
3. Убедитесь, что webhook secret в кабинете/интеграции совпадает с `YOOKASSA_WEBHOOK_SECRET`, если используется shared secret.
4. Приложение обрабатывает события:
   - `payment.succeeded`;
   - `payment.canceled`;
   - `refund.succeeded`.
5. При получении webhook приложение сохраняет raw payload в `PaymentEvent` и повторно проверяет платёж через YooKassa API перед зачислением оплаты.

## 8. Проверить тестовый заказ

После деплоя выполните smoke test:

1. Откройте production/staging URL.
2. Зарегистрируйте тестового пользователя.
3. Создайте заказ на любой услуге.
4. Загрузите jpg/png/webp/pdf файл до 8 МБ.
5. Убедитесь, что объект появился в S3 bucket с ожидаемым `S3_PREFIX`.
6. Откройте заказ из личного кабинета и проверьте скачивание файла через `GET /api/files/[id]`.
7. Запустите оплату через YooKassa sandbox или production test flow, доступный вашему магазину.
8. Проверьте, что webhook обновил `Payment.status`, `Order.paymentStatus` и статус заказа.
9. Войдите под admin user и проверьте `/admin/orders`, `/admin/payments`.

## 9. Rollback notes

- Код можно откатить стандартным rollback/deploy previous release в хостинге.
- Миграции Prisma требуют отдельного плана rollback для изменений схемы. В текущем MVP storage-переключение не меняет схему БД.
- Для storage rollback с `s3` на `local` учитывайте, что уже загруженные в S3 файлы не будут доступны local adapter без миграции объектов и `fileUrl` значений.
