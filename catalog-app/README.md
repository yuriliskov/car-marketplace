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

## Стенд для ревью на GitHub Pages

Публичный URL после деплоя:

[https://yuriliskov.github.io/car-marketplace/](https://yuriliskov.github.io/car-marketplace/)

Каждый `git push` в `main` собирает статический экспорт (`output: 'export'`)
и публикует его через `.github/workflows/pages.yml`. Стенд закрыт от индексации
(`NEXT_PUBLIC_NOINDEX=1`).

Формы заявок на Pages не создают лиды в Bitrix24: GitHub Pages не выполняет
`/api/leads`. Для проверки CRM используйте `npm run dev` локально.
