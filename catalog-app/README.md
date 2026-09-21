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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
