# MVP Inventory — Vercel версия

## Структура
- `client/` — React frontend
- `api/` — Vercel serverless backend (Postgres)

## Запуск локально
1. Установить PostgreSQL и применить схему (как раньше).
2. Настроить `.env.local` в корне проекта:
   ```env
   DATABASE_URL=postgres://user:pass@localhost:5432/mvpinventory
   REACT_APP_API_URL=/api
   ```
3. Запустить фронтенд:
   ```bash
   cd client
   npm install
   npm start
   ```
   Для API можно вызывать прямо локально (через Vercel CLI или node).

## Деплой на Vercel
1. Запушить проект в GitHub.
2. В Vercel → Add New Project → выбрать репозиторий.
3. Указать переменные окружения:
   - `DATABASE_URL` (из Supabase/Neon или Vercel Postgres)
   - `REACT_APP_API_URL=/api`
4. Deploy 🚀

## Дальше
- Добавить авторизацию
- Импорт/экспорт CSV
- Стилизацию (например, MUI или Tailwind)
