# Локальный каталог CHE168

Прототип landing page для Geely Cowboy 2026 с галереями, VR 360°,
характеристиками, калькулятором и локальной тестовой формой.

## Запуск

Установите зависимости и запустите локальный сервер:

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000). Сайт предназначен для
локального просмотра и закрыт от индексации.

## Данные прототипа

- `src/data/vehicle.ts` — данные модели, источники и галерея.
- `src/app/api/leads` — локальное сохранение тестовых заявок.
- `src/app/api/events` — локальный журнал событий.
- `docs/model-research-playbook.md` — повторяемая методика подготовки новых моделей.
- `scripts/import_vr_assets.py` — импорт кадров экстерьера и cubemap интерьера.
- `.local-data/` — локальные JSONL-файлы, исключённые из Git.

Не вводите реальные персональные данные до подключения Bitrix24 и защищённого
production-хранилища.

## Стенд для ревью на Vercel

Приложение серверное: формы заявок работают через `/api/leads` и создают лид
в Bitrix24, поэтому статический хостинг (GitHub Pages) не подходит.

1. [vercel.com/new](https://vercel.com/new) → Import Git Repository →
   репозиторий `car-marketplace` (приватный репозиторий поддерживается).
2. **Root Directory: `catalog-app`** — приложение лежит в подпапке, без этого
   сборка не найдёт `package.json`. Framework определится как Next.js сам.
3. Environment Variables:

   | Переменная | Значение |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | адрес стенда, например `https://car-marketplace.vercel.app` |
   | `NEXT_PUBLIC_NOINDEX` | `1` — чтобы стенд не попал в поисковую выдачу |
   | `BITRIX24_WEBHOOK_URL` | вебхук из Bitrix24 (тот же, что в `.env.local`) |
   | `BITRIX24_SOURCE_ID` | необязательно |
   | `BITRIX24_ASSIGNED_BY_ID` | необязательно |

4. Deploy. Каждый следующий `git push` в `main` обновляет стенд автоматически.

Без `BITRIX24_WEBHOOK_URL` форма отработает, но лид уйдёт только в локальный
журнал стенда (`crm: "disabled"`). Заявки со стенда попадают в тот же Bitrix24,
что и продакшн, — предупредите ревьюеров или завейдите отдельный вебхук.
