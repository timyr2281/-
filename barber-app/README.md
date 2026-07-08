# The Chair — Barber Analytics (прототип)

Аналітика та записи для барбершопу у форматі Telegram Mini App.
React + Vite + Tailwind CSS + lucide-react. Тепла світла тема (класична барберська естетика). Мок-дані.

Вкладки:
- **Огляд** — виручка, записи, завантаженість крісел, повторні візити (rebooking), середній чек, неявки (no-show) + розумні сповіщення.
- **Записи** — розклад на сьогодні (виконано / попереду / неявка), завантаженість по годинах, картка клієнта (візити, LTV, коли був).
- **Майстри** — виручка, рейтинг, rebook, чайові по кожному барберу.
- **Послуги** — популярні послуги + продаж косметики (retail) із залишками.

Усі картки клікаються — відкривається детальне вікно з графіком, порівнянням і порадою «що покращити».

## Локальний запуск

```bash
npm install
npm run dev        # http://localhost:5173
```

## Деплой на Vercel (безкоштовно назавжди)

1. Залий папку в GitHub:
   ```bash
   git init
   git add .
   git commit -m "Barber Analytics"
   git branch -M main
   git remote add origin https://github.com/USERNAME/barber-analytics.git
   git push -u origin main
   ```
2. https://vercel.com → **Add New… → Project → Import** свій репозиторій.
3. Vercel визначить **Vite** автоматично (build і output прописані у `vercel.json`) → **Deploy**.
4. За ~хвилину отримаєш публічний URL `*.vercel.app`.

> Якщо файли лежать усередині папки `barber-app/`, у Vercel:
> **Settings → Build and Deployment → Root Directory → `barber-app`** → Redeploy.

Без GitHub — через CLI з середини папки:
```bash
npm i -g vercel
cd barber-app
vercel --prod
```

## Підключення реальних даних

- **Записи / Майстри / Послуги** — заміни мок-масиви у `src/App.jsx` (`SCHEDULE`, `BARBERS`, `SERVICES`, `RETAIL`, `METRICS`) на дані з CRM записів (Altegio/YCLIENTS, EasyWeek тощо) через їхнє API або власний бекенд.
- **Картка клієнта, rebooking, no-show** — беруться з тієї ж системи запису (історія візитів, статуси).
