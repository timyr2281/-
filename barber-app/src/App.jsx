import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CalendarClock,
  Users,
  Scissors,
  Wallet,
  CalendarDays,
  Armchair,
  UserCheck,
  Receipt,
  Ban,
  TrendingUp,
  TrendingDown,
  Clock,
  Star,
  Banknote,
  ShoppingBag,
  Droplets,
  Crown,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  X,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Trophy,
  Boxes,
  Activity,
  Phone,
} from "lucide-react";

// ═════════════════════════════════════════════════════════════
// The Chair — Barber Analytics (Telegram Mini App прототип)
// Тепла світла тема · класична барберська естетика
// ═════════════════════════════════════════════════════════════

// ── helpers ──────────────────────────────────────────────────
const group = (n) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const fmt = (v, type) => {
  if (type === "percent") return `${Math.round(v)}%`;
  if (type === "currency") return `${group(v)} ₴`;
  if (type === "rating") return (Math.round(v * 10) / 10).toFixed(1);
  return group(v);
};

const zip = (labels, vals) => labels.map((l, i) => ({ label: l, value: vals[i] }));

const L7 = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
const LW = ["Т1", "Т2", "Т3", "Т4"];

// light-theme accent tokens
const ACCENTS = {
  amber: {
    text: "text-amber-600",
    barSel: "bg-gradient-to-t from-amber-500 to-amber-300",
    barDim: "bg-amber-200",
    soft: "bg-amber-100",
  },
  emerald: {
    text: "text-emerald-600",
    barSel: "bg-gradient-to-t from-emerald-500 to-emerald-300",
    barDim: "bg-emerald-200",
    soft: "bg-emerald-100",
  },
  rose: {
    text: "text-rose-600",
    barSel: "bg-gradient-to-t from-rose-500 to-rose-300",
    barDim: "bg-rose-200",
    soft: "bg-rose-100",
  },
  slate: {
    text: "text-slate-700",
    barSel: "bg-gradient-to-t from-slate-600 to-slate-400",
    barDim: "bg-slate-200",
    soft: "bg-slate-100",
  },
};

const BREAK_COLORS = {
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  slate: "bg-slate-600",
  rose: "bg-rose-500",
  sky: "bg-sky-500",
  stone: "bg-stone-300",
};

// ═════════════════════════════════════════════════════════════
// STATIC CONFIG
// ═════════════════════════════════════════════════════════════

const PERIODS = ["Сьогодні", "Тиждень", "Місяць"];

const TABS = [
  { id: "overview", label: "Огляд", icon: LayoutDashboard },
  { id: "schedule", label: "Записи", icon: CalendarClock },
  { id: "barbers", label: "Майстри", icon: Users },
  { id: "services", label: "Послуги", icon: Scissors },
];

// ── Overview metrics ─────────────────────────────────────────
const METRICS = {
  revenue: {
    title: "Виручка",
    icon: Wallet,
    accent: "amber",
    format: "currency",
    agg: "sum",
    timeframes: {
      "7 днів": { data: zip(L7, [11200, 9800, 12400, 8600, 15800, 21400, 6200]), prev: 78000 },
      Місяць: { data: zip(LW, [82000, 76000, 91000, 68000]), prev: 295000 },
    },
    breakdown: {
      title: "З чого виручка",
      items: [
        { label: "Послуги (стрижки/гоління)", value: 78, color: "amber" },
        { label: "Косметика (retail)", value: 14, color: "emerald" },
        { label: "Чайові майстрам", value: 8, color: "slate" },
      ],
    },
    insight: {
      tone: "warn",
      title: "Що покращити",
      text: "Пік — субота (21 400 ₴), провал — неділя й четвер. Косметика лише 14% виручки, хоча маржа на ній найвища. Постав вітрину з засобами біля дзеркала кожного крісла й додай майстрам скрипт «цим я укладав, візьміть додому» — реально +6–8% до чека.",
    },
  },
  appointments: {
    title: "Записи",
    icon: CalendarDays,
    accent: "slate",
    format: "number",
    agg: "sum",
    timeframes: {
      "7 днів": { data: zip(L7, [24, 21, 26, 18, 31, 38, 14]), prev: 158 },
      Місяць: { data: zip(LW, [172, 160, 188, 142]), prev: 640 },
    },
    breakdown: {
      title: "Джерела запису",
      items: [
        { label: "Повторний запис (rebook)", value: 41, color: "emerald" },
        { label: "Instagram", value: 27, color: "amber" },
        { label: "Telegram-бот", value: 18, color: "slate" },
        { label: "Google / сайт", value: 14, color: "sky" },
      ],
    },
    insight: {
      tone: "good",
      title: "Що покращити",
      text: "41% записів — повторні: клієнти повертаються, це здоровий знак. Instagram — головне зовнішнє джерело. Слабке місце: багато хто записується в переписці вручну. Переведи більше людей на Telegram-бот з автонагадуванням — розвантажить адміністратора й знизить неявки.",
    },
  },
  occupancy: {
    title: "Завантаженість крісел",
    icon: Armchair,
    accent: "amber",
    format: "percent",
    agg: "avg",
    timeframes: {
      "7 днів": { data: zip(L7, [72, 66, 78, 58, 88, 96, 44]), prev: 70 },
      Місяць: { data: zip(LW, [74, 71, 80, 63]), prev: 68 },
    },
    breakdown: {
      title: "Завантаженість майстрів",
      items: [
        { label: "Артем (топ)", value: 92, color: "emerald" },
        { label: "Роман", value: 84, color: "amber" },
        { label: "Влад", value: 71, color: "slate" },
        { label: "Денис (джун)", value: 58, color: "rose" },
      ],
    },
    insight: {
      tone: "warn",
      title: "Що покращити",
      text: "Середня завантаженість 72% — є куди рости. Артем перевантажений (92%, черга на тиждень уперед), а Денис простоює (58%). Перекинь частину нових клієнтів на Дениса зі знижкою «−15% до джуна» і став його в пікові вечори — це вирівняє крісла й підніме загальну виручку.",
    },
  },
  rebooking: {
    title: "Повторні візити",
    icon: UserCheck,
    accent: "emerald",
    format: "percent",
    agg: "avg",
    timeframes: {
      "7 днів": { data: zip(L7, [64, 61, 68, 59, 66, 71, 62]), prev: 62 },
      Місяць: { data: zip(LW, [64, 66, 67, 65]), prev: 60 },
    },
    breakdown: {
      title: "Коли записуються наступного разу",
      items: [
        { label: "Одразу на касі", value: 46, color: "emerald" },
        { label: "Через бота (нагадування)", value: 31, color: "amber" },
        { label: "Самі повертаються пізніше", value: 23, color: "slate" },
      ],
    },
    insight: {
      tone: "good",
      title: "Що покращити",
      text: "65% клієнтів повертаються — це основа барбершопу (регулярна стрижка раз на 3–4 тижні). Найсильніший важіль — запис наступного візиту прямо на касі (46%). Навчи адміністратора завжди пропонувати «той самий час через 3 тижні?» — кожні +5 п.п. rebooking це стабільні гроші наперед.",
    },
  },
  avgcheck: {
    title: "Середній чек",
    icon: Receipt,
    accent: "amber",
    format: "currency",
    agg: "avg",
    timeframes: {
      "7 днів": { data: zip(L7, [520, 495, 540, 470, 580, 610, 450]), prev: 505 },
      Місяць: { data: zip(LW, [525, 510, 560, 480]), prev: 490 },
    },
    breakdown: {
      title: "З чого складається чек",
      items: [
        { label: "Основна послуга", value: 74, color: "amber" },
        { label: "Допослуга (борода/камуфляж)", value: 16, color: "slate" },
        { label: "Косметика додому", value: 10, color: "emerald" },
      ],
    },
    insight: {
      tone: "good",
      title: "Що покращити",
      text: "Середній чек 540 ₴ і росте за рахунок допослуг. Наступний важіль — косметика (лише 10% чека). Введи бандл «стрижка + засіб для укладки −20%» і давай майстрам % з продажу засобів — це найшвидший спосіб підняти чек ще на ~50–70 ₴ без підняття цін на стрижку.",
    },
  },
  noshow: {
    title: "Неявки (No-show)",
    icon: Ban,
    accent: "rose",
    format: "percent",
    agg: "avg",
    invertDelta: true,
    timeframes: {
      "7 днів": { data: zip(L7, [11, 9, 12, 14, 8, 7, 15]), prev: 10 },
      Місяць: { data: zip(LW, [11, 10, 9, 12]), prev: 13 },
    },
    breakdown: {
      title: "Причини неявок",
      items: [
        { label: "Забув / не прийшов", value: 52, color: "rose" },
        { label: "Скасував в останній момент", value: 30, color: "amber" },
        { label: "Подвійний запис", value: 18, color: "slate" },
      ],
    },
    insight: {
      tone: "warn",
      title: "Що покращити",
      text: "10.5% неявок — це прямий простій крісла й мінус гроші (≈ 5 500 ₴/тиждень). Головна причина — просто забувають. Увімкни в боті передоплату 100 ₴ і авто-нагадування за 2 год до візиту: у барбершопах це знижує no-show на 50–60%. Найгірші дні — Чт і Нд.",
    },
  },
};

// ── Schedule (today) ─────────────────────────────────────────
const SCHEDULE = [
  { time: "10:00", client: "Ігор К.", barber: "Артем", service: "Стрижка + борода", price: 650, status: "done", visits: 14, ltv: 8600, last: "3 тижні тому" },
  { time: "11:00", client: "Максим Д.", barber: "Роман", service: "Стрижка", price: 400, status: "done", visits: 6, ltv: 2400, last: "4 тижні тому" },
  { time: "12:30", client: "Олег В.", barber: "Влад", service: "Королівське гоління", price: 800, status: "noshow", visits: 2, ltv: 1200, last: "2 місяці тому" },
  { time: "14:00", client: "Андрій С.", barber: "Артем", service: "Камуфляж сивини", price: 550, status: "upcoming", visits: 9, ltv: 5100, last: "3 тижні тому" },
  { time: "15:30", client: "Дмитро Л.", barber: "Роман", service: "Стрижка + борода", price: 650, status: "upcoming", visits: 11, ltv: 6800, last: "3 тижні тому" },
  { time: "17:00", client: "Тарас М.", barber: "Влад", service: "Оформлення бороди", price: 350, status: "upcoming", visits: 4, ltv: 1500, last: "5 тижнів тому" },
  { time: "18:30", client: "Юрій П.", barber: "Артем", service: "Стрижка", price: 400, status: "upcoming", visits: 22, ltv: 9900, last: "2 тижні тому" },
];

const HOURS = [
  { h: "9", v: 40 },
  { h: "10", v: 70 },
  { h: "11", v: 85 },
  { h: "12", v: 75 },
  { h: "13", v: 45 },
  { h: "14", v: 65 },
  { h: "15", v: 88 },
  { h: "16", v: 95 },
  { h: "17", v: 100 },
  { h: "18", v: 92 },
  { h: "19", v: 78 },
  { h: "20", v: 55 },
];

function makeClientDetail(a) {
  const overdue = a.last.includes("місяц");
  return {
    title: a.client,
    icon: overdue ? AlertTriangle : UserCheck,
    accent: overdue ? "rose" : "emerald",
    format: "currency",
    hideChart: true,
    stats: [
      { label: "Візитів", value: `${a.visits}`, tone: "neutral" },
      { label: "LTV", value: `${group(a.ltv)} ₴`, tone: "good" },
      { label: "Був", value: a.last, tone: overdue ? "warn" : "neutral" },
    ],
    breakdown: {
      title: "Профіль клієнта",
      items: [
        { label: `Улюблений майстер: ${a.barber}`, value: 100, color: "amber" },
        { label: `Звична послуга: ${a.service}`, value: 80, color: "slate" },
        { label: `Сер. чек: ${group(Math.round(a.ltv / a.visits))} ₴`, value: 60, color: "emerald" },
      ],
    },
    insight: overdue
      ? {
          tone: "warn",
          title: "Клієнт «застиг»",
          text: `${a.client} не був ${a.last} — це вже поза звичним циклом. Надішли персональне нагадування через бота з промо −15% на наступний візит, щоб не втратити його остаточно.`,
        }
      : {
          tone: "good",
          title: "Постійний клієнт",
          text: `${a.client} ходить регулярно (${a.visits} візитів, LTV ${group(a.ltv)} ₴). Одразу після сеансу запиши його на той самий час через 3 тижні — постійники так і тримаються.`,
        },
  };
}

// ── Barbers ──────────────────────────────────────────────────
const BARBERS = [
  { name: "Артем", role: "Топ-майстер", rev: 4200, appts: 8, rating: 4.9, rebook: 78, tips: 640, trend: [3.8, 4.0, 3.6, 4.2, 4.6, 5.1, 4.2] },
  { name: "Роман", role: "Барбер", rev: 3600, appts: 7, rating: 4.8, rebook: 72, tips: 520, trend: [3.2, 3.4, 3.0, 3.6, 4.0, 4.5, 3.6] },
  { name: "Влад", role: "Барбер", rev: 2900, appts: 6, rating: 4.6, rebook: 64, tips: 410, trend: [2.6, 2.8, 2.4, 3.0, 3.3, 3.7, 2.9] },
  { name: "Денис", role: "Джуніор", rev: 1800, appts: 5, rating: 4.4, rebook: 51, tips: 230, trend: [1.5, 1.7, 1.4, 1.9, 2.1, 2.4, 1.8] },
];

function makeBarberDetail(b) {
  const good = b.rebook >= 70;
  return {
    title: `${b.name} · ${b.role}`,
    icon: good ? Trophy : Users,
    accent: good ? "emerald" : "amber",
    format: "currency",
    agg: "sum",
    timeframes: {
      "Виручка · 7 днів": { data: zip(L7, b.trend.map((x) => x * 1000)), prev: b.trend.reduce((a, x) => a + x, 0) * 1000 - 2500 },
    },
    stats: [
      { label: "Записів сьогодні", value: `${b.appts}`, tone: "neutral" },
      { label: "Рейтинг", value: `★ ${b.rating}`, tone: "good" },
      { label: "Rebook", value: `${b.rebook}%`, tone: good ? "good" : "warn" },
    ],
    breakdown: {
      title: "Структура послуг",
      items: [
        { label: "Стрижка + борода", value: 44, color: "amber" },
        { label: "Стрижка", value: 33, color: "slate" },
        { label: "Гоління / догляд бороди", value: 23, color: "emerald" },
      ],
    },
    insight: good
      ? {
          tone: "good",
          title: `Чайові сьогодні: ${group(b.tips)} ₴`,
          text: `${b.name} — сильний майстер: rebook ${b.rebook}%, рейтинг ${b.rating}. Клієнти повертаються саме до нього. Тримай його розклад заповненим наперед і не став на джуніорські слоти — його година коштує дорожче.`,
        }
      : {
          tone: "warn",
          title: `Чайові сьогодні: ${group(b.tips)} ₴`,
          text: `У ${b.name} rebook лише ${b.rebook}% — клієнти рідко повертаються саме до нього. Попрацюй над завершенням сеансу: порада по догляду + запис на наступний раз на касі. Дай пробні слоти з відгуками, щоб підняти рейтинг з ${b.rating}.`,
        },
  };
}

// ── Services + retail ────────────────────────────────────────
const SERVICES = [
  { name: "Стрижка", icon: Scissors, count: 42, price: 400, share: 31, trend: [6, 5, 7, 4, 6, 8, 6] },
  { name: "Стрижка + борода", icon: Scissors, count: 31, price: 650, share: 34, trend: [4, 4, 5, 3, 5, 6, 4] },
  { name: "Оформлення бороди", icon: Scissors, count: 22, price: 350, share: 13, trend: [3, 2, 3, 2, 4, 5, 3] },
  { name: "Камуфляж сивини", icon: Sparkles, count: 14, price: 550, share: 13, trend: [2, 1, 2, 1, 3, 3, 2] },
  { name: "Королівське гоління", icon: Crown, count: 9, price: 800, share: 12, trend: [1, 1, 2, 1, 1, 2, 1] },
];

function makeServiceDetail(s) {
  return {
    title: s.name,
    icon: s.icon || Scissors,
    accent: "amber",
    format: "number",
    agg: "sum",
    unitWord: "разів",
    timeframes: { "7 днів": { data: zip(L7, s.trend), prev: s.trend.reduce((a, b) => a + b, 0) - 3 } },
    stats: [
      { label: "Ціна", value: `${s.price} ₴`, tone: "neutral" },
      { label: "За тиждень", value: `${s.count}`, tone: "good" },
      { label: "Частка виручки", value: `${s.share}%`, tone: "neutral" },
    ],
    breakdown: {
      title: "Хто найчастіше робить",
      items: [
        { label: "Артем", value: 38, color: "amber" },
        { label: "Роман", value: 30, color: "slate" },
        { label: "Влад", value: 20, color: "emerald" },
        { label: "Денис", value: 12, color: "sky" },
      ],
    },
    insight: {
      tone: "good",
      title: "Що покращити",
      text: `«${s.name}» дає ${s.share}% виручки при ціні ${s.price} ₴. ${
        s.price >= 550
          ? "Це висока маржа — просувай саме її в Instagram (до/після), такі послуги піднімають середній чек."
          : "Базова послуга-магніт: використовуй її, щоб допродати бороду/догляд і записати клієнта на повторний візит."
      }`,
    },
  };
}

const RETAIL = [
  { name: "Масло для бороди", sold: 14, stock: 22, price: 320, status: "ok", trend: [2, 1, 3, 2, 2, 3, 1] },
  { name: "Помада для укладки", sold: 11, stock: 5, price: 290, status: "low", trend: [1, 2, 2, 1, 2, 2, 1] },
  { name: "Матова глина", sold: 9, stock: 18, price: 310, status: "ok", trend: [1, 1, 2, 1, 2, 1, 1] },
  { name: "Шампунь для бороди", sold: 6, stock: 3, price: 270, status: "low", trend: [1, 0, 1, 1, 1, 2, 0] },
];

function makeRetailDetail(r) {
  const avg = r.trend.reduce((a, b) => a + b, 0) / r.trend.length;
  const days = Math.max(1, Math.round(r.stock / Math.max(avg, 0.1)));
  const low = r.status === "low";
  return {
    title: r.name,
    icon: low ? AlertTriangle : Droplets,
    accent: low ? "rose" : "emerald",
    format: "number",
    agg: "sum",
    unitWord: "шт",
    timeframes: { "Продажі · 7 днів": { data: zip(L7, r.trend), prev: r.trend.reduce((a, b) => a + b, 0) - 1 } },
    stats: [
      { label: "Залишок", value: `${r.stock} шт`, tone: low ? "warn" : "good" },
      { label: "Ціна", value: `${r.price} ₴`, tone: "neutral" },
      { label: "Вистачить на", value: `${days} дн`, tone: low ? "warn" : "good" },
    ],
    insight: low
      ? {
          tone: "warn",
          title: "Час дозамовити",
          text: `Залишок ${r.stock} шт — вистачить лише на ~${days} дн. Косметика має найвищу маржу в барбершопі, тримати її в наявності обов'язково. Оформ дозамовлення й постав засіб на видне місце біля дзеркала.`,
        }
      : {
          tone: "good",
          title: "Запас у нормі",
          text: `«${r.name}» забезпечено на ${days} днів. Продажі стабільні. Нагадуй майстрам рекомендувати саме той засіб, яким укладали клієнта — це найприродніший допродаж.`,
        },
  };
}

// ═════════════════════════════════════════════════════════════
// UI PRIMITIVES (light theme)
// ═════════════════════════════════════════════════════════════

function Card({ children, className = "", onClick }) {
  const clickable = typeof onClick === "function";
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-stone-200 bg-white p-4 shadow-sm ${
        clickable ? "cursor-pointer transition-all active:scale-[0.98] hover:border-stone-300 hover:shadow-md" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

function ProgressBar({ value, danger }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
      <div
        className={`h-full rounded-full transition-all duration-700 ${
          danger ? "bg-gradient-to-r from-rose-500 to-rose-400" : "bg-gradient-to-r from-amber-500 to-amber-400"
        }`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function BarChart({ data, accent, selected, onSelect }) {
  const A = ACCENTS[accent] || ACCENTS.amber;
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex h-40 items-end gap-1.5">
      {data.map((d, i) => {
        const h = (d.value / max) * 100;
        const isSel = i === selected;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className="flex flex-1 flex-col items-center justify-end gap-1.5"
            style={{ height: "100%" }}
          >
            <div className="flex w-full flex-1 items-end">
              <div
                className={`w-full rounded-t-md transition-all duration-300 ${isSel ? A.barSel : A.barDim}`}
                style={{ height: `${Math.max(h, 4)}%` }}
              />
            </div>
            <span className={`text-[8px] ${isSel ? A.text : "text-stone-400"}`}>{d.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function BreakdownList({ breakdown }) {
  return (
    <div className="space-y-2.5">
      {breakdown.items.map((it) => (
        <div key={it.label}>
          <div className="mb-1 flex items-center justify-between text-[11px]">
            <span className="text-stone-500">{it.label}</span>
            <span className="font-semibold text-stone-800">{it.value}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
            <div className={`h-full rounded-full ${BREAK_COLORS[it.color] || "bg-stone-300"}`} style={{ width: `${it.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// DETAIL SHEET (bottom modal, light)
// ═════════════════════════════════════════════════════════════

function DetailSheet({ detail, onClose }) {
  const tfKeys = detail.timeframes ? Object.keys(detail.timeframes) : [];
  const [tf, setTf] = useState(tfKeys[0]);
  const [sel, setSel] = useState(0);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!detail.timeframes) return;
    setSel(detail.timeframes[tf].data.length - 1);
  }, [tf, detail]);

  const close = () => {
    setShown(false);
    setTimeout(onClose, 250);
  };

  const A = ACCENTS[detail.accent] || ACCENTS.amber;
  const Icon = detail.icon || Activity;

  let hero = null;
  let deltaPct = null;
  let best = null;
  let worst = null;
  let avg = null;
  if (detail.timeframes) {
    const cur = detail.timeframes[tf];
    const vals = cur.data.map((d) => d.value);
    const sum = vals.reduce((a, b) => a + b, 0);
    avg = sum / vals.length;
    hero = detail.agg === "avg" ? avg : sum;
    const prevAgg = cur.prev;
    if (prevAgg) deltaPct = Math.round(((hero - prevAgg) / prevAgg) * 100);
    const maxV = Math.max(...vals);
    const minV = Math.min(...vals);
    best = cur.data.find((d) => d.value === maxV);
    worst = cur.data.find((d) => d.value === minV);
  }
  const rising = deltaPct != null && deltaPct >= 0;
  const up = detail.invertDelta ? !rising : rising;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div
        onClick={close}
        className={`absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity duration-250 ${
          shown ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`relative max-h-[88%] overflow-y-auto rounded-t-[2rem] border-t border-stone-200 bg-stone-50 pb-6 shadow-2xl transition-transform duration-300 ease-out ${
          shown ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="sticky top-0 z-10 flex justify-center bg-stone-50 pt-3">
          <div className="h-1.5 w-12 rounded-full bg-stone-300" />
        </div>

        <div className="px-5 pt-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${A.soft}`}>
                <Icon className={`h-5 w-5 ${A.text}`} />
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-stone-900">{detail.title}</h2>
                {tfKeys.length > 0 && <p className="text-[11px] text-stone-500">Період: {tf}</p>}
              </div>
            </div>
            <button
              onClick={close}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-stone-500 hover:bg-stone-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {hero != null && (
            <div className="mt-4 flex items-end gap-3">
              <div className={`text-4xl font-bold tracking-tight ${A.text}`}>{fmt(hero, detail.format)}</div>
              {deltaPct != null && (
                <div
                  className={`mb-1.5 flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    up ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {rising ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {rising ? "+" : ""}
                  {deltaPct}%
                </div>
              )}
            </div>
          )}
          {deltaPct != null && <p className="mt-1 text-[11px] text-stone-500">vs попередній період</p>}

          {tfKeys.length > 1 && (
            <div className="mt-4 flex gap-2">
              {tfKeys.map((k) => (
                <button
                  key={k}
                  onClick={() => setTf(k)}
                  className={`flex-1 rounded-xl px-3 py-1.5 text-[12px] font-medium transition-all ${
                    tf === k ? "bg-stone-900 text-white" : "bg-white text-stone-500 hover:bg-stone-100"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          )}

          {detail.timeframes && !detail.hideChart && (
            <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] text-stone-500">Обрано: {detail.timeframes[tf].data[sel]?.label}</span>
                <span className={`text-sm font-semibold ${A.text}`}>
                  {fmt(detail.timeframes[tf].data[sel]?.value || 0, detail.format)}
                  {detail.unitWord ? ` ${detail.unitWord}` : ""}
                </span>
              </div>
              <BarChart data={detail.timeframes[tf].data} accent={detail.accent} selected={sel} onSelect={setSel} />
            </div>
          )}

          {best && worst && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-stone-200 bg-white p-2.5 text-center">
                <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-600">
                  <Trophy className="h-3 w-3" /> Найкращий
                </div>
                <div className="mt-1 text-[13px] font-semibold text-stone-900">{best.label}</div>
                <div className="text-[9px] text-stone-500">{fmt(best.value, detail.format)}</div>
              </div>
              <div className="rounded-xl border border-stone-200 bg-white p-2.5 text-center">
                <div className="text-[10px] text-stone-500">Середнє</div>
                <div className="mt-1 text-[13px] font-semibold text-stone-900">{fmt(avg, detail.format)}</div>
                <div className="text-[9px] text-stone-500">за період</div>
              </div>
              <div className="rounded-xl border border-stone-200 bg-white p-2.5 text-center">
                <div className="flex items-center justify-center gap-1 text-[10px] text-rose-600">
                  <TrendingDown className="h-3 w-3" /> Найслабший
                </div>
                <div className="mt-1 text-[13px] font-semibold text-stone-900">{worst.label}</div>
                <div className="text-[9px] text-stone-500">{fmt(worst.value, detail.format)}</div>
              </div>
            </div>
          )}

          {detail.stats && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {detail.stats.map((st) => (
                <div key={st.label} className="rounded-xl border border-stone-200 bg-white p-2.5 text-center">
                  <div className="text-[10px] text-stone-500">{st.label}</div>
                  <div
                    className={`mt-1 text-[13px] font-semibold ${
                      st.tone === "good" ? "text-emerald-600" : st.tone === "warn" ? "text-rose-600" : "text-stone-900"
                    }`}
                  >
                    {st.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {detail.breakdown && (
            <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-stone-400">
                <Boxes className="h-3.5 w-3.5" /> {detail.breakdown.title}
              </div>
              <BreakdownList breakdown={detail.breakdown} />
            </div>
          )}

          {detail.insight && (
            <div
              className={`mt-4 rounded-2xl border p-4 ${
                detail.insight.tone === "good" ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"
              }`}
            >
              <div
                className={`flex items-center gap-2 text-[12px] font-semibold ${
                  detail.insight.tone === "good" ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                <Sparkles className="h-4 w-4" /> {detail.insight.title}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-stone-600">{detail.insight.text}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// TAB: OVERVIEW
// ═════════════════════════════════════════════════════════════

function KpiMini({ icon: Icon, label, value, sub, subTone = "muted", accent = "text-stone-900", onClick }) {
  return (
    <Card onClick={onClick}>
      <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-stone-400">
        <span className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5" /> {label}
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-stone-300" />
      </div>
      <div className={`mt-2 text-2xl font-semibold tracking-tight ${accent}`}>{value}</div>
      <div
        className={`mt-1 text-[11px] ${
          subTone === "good" ? "text-emerald-600" : subTone === "warn" ? "text-rose-600" : "text-stone-500"
        }`}
      >
        {sub}
      </div>
    </Card>
  );
}

function OverviewTab({ onOpen }) {
  const occupancy = 78;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <KpiMini icon={Wallet} label="Виручка" value={<>15 800 <span className="text-lg text-stone-400">₴</span></>} sub="Послуги 78% · Косметика 14%" onClick={() => onOpen(METRICS.revenue)} />
        <KpiMini icon={CalendarDays} label="Записи" value="31" sub="26 виконано · 5 попереду" onClick={() => onOpen(METRICS.appointments)} />
      </div>

      {/* Occupancy hero */}
      <Card onClick={() => onOpen(METRICS.occupancy)} className="border-amber-200 bg-amber-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-amber-700/70">
            <Armchair className="h-3.5 w-3.5" /> Завантаженість крісел
          </div>
          <span className="text-[10px] text-stone-500">3 крісла · зараз 2 зайнято</span>
        </div>
        <div className="mt-1 flex items-end gap-3">
          <div className="text-5xl font-bold tracking-tighter text-amber-600">{occupancy}%</div>
          <div className="mb-2 flex items-center gap-1 text-[11px] text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5" /> +8% до вчора
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar value={occupancy} />
          <div className="mt-1.5 flex justify-between text-[10px] text-stone-500">
            <span>Артем 92% · Денис 58%</span>
            <span>ціль: 80%+</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <KpiMini icon={UserCheck} label="Повторні візити" value="65%" sub="46% — запис на касі" subTone="good" accent="text-emerald-600" onClick={() => onOpen(METRICS.rebooking)} />
        <KpiMini icon={Receipt} label="Середній чек" value={<>540 <span className="text-lg text-stone-400">₴</span></>} sub="+7% до вчора" subTone="good" onClick={() => onOpen(METRICS.avgcheck)} />
      </div>

      <KpiMini icon={Ban} label="Неявки (No-show)" value="10.5%" sub="52% — просто забули прийти" subTone="warn" accent="text-rose-600" onClick={() => onOpen(METRICS.noshow)} />

      {/* Smart alerts */}
      <div>
        <div className="mb-2 flex items-center gap-2 px-1 text-[11px] font-medium uppercase tracking-wide text-stone-400">
          <Activity className="h-3.5 w-3.5 text-amber-600" /> Розумні сповіщення
        </div>
        <div className="space-y-2.5">
          <div className="relative overflow-hidden rounded-2xl border border-rose-200 bg-rose-50 p-3.5">
            <div className="absolute inset-y-0 left-0 w-1 bg-rose-500" />
            <div className="flex gap-3 pl-1.5">
              <Ban className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
              <div>
                <div className="text-[12px] font-semibold text-rose-700">No-show росте</div>
                <p className="mt-1 text-[11px] leading-relaxed text-stone-600">
                  3 неявки цього тижня без передоплати — це ≈ 1 800 ₴ простою. Увімкни в боті передоплату 100 ₴ і
                  нагадування за 2 год: знизить неявки на ~60%.
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-amber-50 p-3.5">
            <div className="absolute inset-y-0 left-0 w-1 bg-amber-500" />
            <div className="flex gap-3 pl-1.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <div className="text-[12px] font-semibold text-amber-700">Вікно простою завтра</div>
                <p className="mt-1 text-[11px] leading-relaxed text-stone-600">
                  У Романа завтра 14:00–16:00 три вільні слоти. Дай сторіз «є місця на завтра» — інакше ≈ 1 350 ₴
                  недозаробітку.
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
            <div className="absolute inset-y-0 left-0 w-1 bg-slate-400" />
            <div className="flex gap-3 pl-1.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              <div>
                <div className="text-[12px] font-semibold text-slate-700">Повернути «застиглих»</div>
                <p className="mt-1 text-[11px] leading-relaxed text-stone-600">
                  12 клієнтів не були 6+ тижнів (зазвичай ходять раз на 3). Надішли їм через бота промо −15% на
                  найближчий тиждень.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// TAB: SCHEDULE
// ═════════════════════════════════════════════════════════════

function hourFill(v) {
  if (v >= 90) return "bg-amber-600";
  if (v >= 70) return "bg-amber-500";
  if (v >= 50) return "bg-amber-400";
  return "bg-amber-200";
}

const STATUS = {
  done: { label: "Виконано", color: "text-emerald-600", bg: "bg-emerald-100", icon: CheckCircle2 },
  upcoming: { label: "Попереду", color: "text-amber-600", bg: "bg-amber-100", icon: Clock },
  noshow: { label: "Не прийшов", color: "text-rose-600", bg: "bg-rose-100", icon: Ban },
};

function ScheduleTab({ onOpen }) {
  const done = SCHEDULE.filter((s) => s.status === "done").length;
  const upcoming = SCHEDULE.filter((s) => s.status === "upcoming").length;
  const noshow = SCHEDULE.filter((s) => s.status === "noshow").length;
  const maxH = Math.max(...HOURS.map((h) => h.v));

  return (
    <div className="space-y-4">
      {/* summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <div className="text-2xl font-bold text-emerald-600">{done}</div>
          <div className="text-[10px] text-stone-500">виконано</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-amber-600">{upcoming}</div>
          <div className="text-[10px] text-stone-500">попереду</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-rose-600">{noshow}</div>
          <div className="text-[10px] text-stone-500">неявка</div>
        </Card>
      </div>

      {/* occupancy by hour */}
      <Card>
        <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-stone-400">
          <Armchair className="h-3.5 w-3.5" /> Завантаженість по годинах
        </div>
        <div className="flex h-28 items-end gap-1">
          {HOURS.map((h) => (
            <div key={h.h} className="flex flex-1 flex-col items-center justify-end gap-1" style={{ height: "100%" }}>
              <div className="flex w-full flex-1 items-end">
                <div className={`w-full rounded-t ${hourFill(h.v)}`} style={{ height: `${(h.v / maxH) * 100}%` }} />
              </div>
              <span className="text-[8px] text-stone-400">{h.h}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[10px] text-amber-700">
          <TrendingUp className="h-3 w-3" /> Пік — 16:00–18:00. Саме тут став найсильніших майстрів.
        </div>
      </Card>

      {/* timeline */}
      <div>
        <div className="mb-2 flex items-center gap-2 px-1 text-[11px] font-medium uppercase tracking-wide text-stone-400">
          <CalendarClock className="h-3.5 w-3.5" /> Розклад на сьогодні
        </div>
        <div className="space-y-2">
          {SCHEDULE.map((a) => {
            const st = STATUS[a.status];
            const StIcon = st.icon;
            return (
              <Card key={a.time + a.client} className="p-3" onClick={() => onOpen(makeClientDetail(a))}>
                <div className="flex items-center gap-3">
                  <div className="w-12 shrink-0 text-center">
                    <div className="text-[13px] font-semibold text-stone-900">{a.time}</div>
                  </div>
                  <div className="h-9 w-px bg-stone-200" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-stone-900">{a.client}</span>
                      <span className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-medium ${st.bg} ${st.color}`}>
                        <StIcon className="h-2.5 w-2.5" /> {st.label}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-500">
                      {a.service} · {a.barber}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-semibold text-amber-600">{a.price} ₴</div>
                    <ChevronRight className="ml-auto h-4 w-4 text-stone-300" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// TAB: BARBERS
// ═════════════════════════════════════════════════════════════

function BarbersTab({ onOpen }) {
  const totalTips = BARBERS.reduce((a, b) => a + b.tips, 0);
  return (
    <div className="space-y-4">
      <Card className="border-amber-200 bg-amber-50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-amber-700/70">Чайові команди сьогодні</div>
            <p className="mt-1 text-[11px] text-stone-500">Тапни майстра для розбору</p>
          </div>
          <div className="flex items-center gap-1 text-2xl font-bold text-amber-600">
            <Banknote className="h-5 w-5" /> {group(totalTips)} ₴
          </div>
        </div>
      </Card>

      <div className="space-y-2.5">
        {BARBERS.map((b) => {
          const good = b.rebook >= 70;
          return (
            <Card key={b.name} onClick={() => onOpen(makeBarberDetail(b))}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-700">
                    {b.name[0]}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-stone-900">{b.name}</div>
                    <div className="flex items-center gap-2 text-[10px] text-stone-500">
                      <span>{b.role}</span>
                      <span className="flex items-center gap-0.5 text-amber-600">
                        <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" /> {b.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[15px] font-bold text-stone-900">{group(b.rev)} ₴</div>
                  <div className="text-[10px] text-stone-500">{b.appts} записів</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-[10px]">
                  <span className="text-stone-500">Rebook (повернення клієнтів)</span>
                  <span className={`font-semibold ${good ? "text-emerald-600" : "text-rose-600"}`}>{b.rebook}%</span>
                </div>
                <ProgressBar value={b.rebook} danger={!good} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-[11px] leading-relaxed text-stone-600">
        <span className="font-semibold text-rose-700">Фокус тижня: </span>
        У Дениса rebook лише 51% — клієнти рідко повертаються. Індивідуальне навчання завершення сеансу + запис на касі.
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// TAB: SERVICES + RETAIL
// ═════════════════════════════════════════════════════════════

function ServicesTab({ onOpen }) {
  const maxCount = Math.max(...SERVICES.map((s) => s.count));
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center gap-2 px-1 text-[11px] font-medium uppercase tracking-wide text-stone-400">
          <Scissors className="h-3.5 w-3.5" /> Популярні послуги · тиждень
        </div>
        <div className="space-y-2">
          {SERVICES.map((s) => {
            const SIcon = s.icon || Scissors;
            return (
              <Card key={s.name} className="p-3.5" onClick={() => onOpen(makeServiceDetail(s))}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                      <SIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[12px] font-medium text-stone-900">{s.name}</div>
                      <div className="text-[10px] text-stone-500">{s.price} ₴ · частка {s.share}%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-stone-900">{s.count}×</span>
                    <ChevronRight className="h-4 w-4 text-stone-300" />
                  </div>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${(s.count / maxCount) * 100}%` }} />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2 px-1 text-[11px] font-medium uppercase tracking-wide text-stone-400">
          <ShoppingBag className="h-3.5 w-3.5" /> Косметика (retail)
        </div>
        <div className="space-y-2">
          {RETAIL.map((r) => {
            const low = r.status === "low";
            return (
              <Card key={r.name} className="flex items-center justify-between p-3.5" onClick={() => onOpen(makeRetailDetail(r))}>
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${low ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"}`}>
                    <Droplets className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[12px] font-medium text-stone-900">{r.name}</div>
                    <div className="text-[10px] text-stone-500">
                      {r.sold} продано · {r.price} ₴
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[13px] font-semibold ${low ? "text-rose-600" : "text-stone-900"}`}>{r.stock} шт</span>
                  {low && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-medium text-rose-600">мало</span>}
                  <ChevronRight className="h-4 w-4 text-stone-300" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// ROOT
// ═════════════════════════════════════════════════════════════

export default function BarberDashboard() {
  const [tab, setTab] = useState("overview");
  const [period, setPeriod] = useState("Сьогодні");
  const [detail, setDetail] = useState(null);

  return (
    <div className="flex min-h-[100dvh] w-full justify-center bg-stone-100 font-sans text-stone-900">
      <div className="relative flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-stone-100">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-amber-300/30 blur-3xl" />

        <header className="relative z-10 shrink-0 border-b border-stone-200 bg-stone-50/80 px-5 pb-4 pt-5 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-[20px] font-bold tracking-tight text-stone-900">The Chair</h1>
              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-emerald-600">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Відкрито до 21:00
                <span className="text-stone-400">· 2/3 крісла зайнято</span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-amber-400">
              <Scissors className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex-1 rounded-xl px-3 py-1.5 text-[12px] font-medium transition-all ${
                  period === p ? "bg-stone-900 text-white shadow-sm" : "bg-white text-stone-500 hover:bg-stone-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </header>

        <main className="relative flex-1 overflow-y-auto px-5 py-4">
          {tab === "overview" && <OverviewTab onOpen={setDetail} />}
          {tab === "schedule" && <ScheduleTab onOpen={setDetail} />}
          {tab === "barbers" && <BarbersTab onOpen={setDetail} />}
          {tab === "services" && <ServicesTab onOpen={setDetail} />}
        </main>

        <nav className="shrink-0 border-t border-stone-200 bg-stone-50/90 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur">
          <div className="flex items-center justify-around">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 transition-all ${
                    active ? "text-amber-600" : "text-stone-400 hover:text-stone-600"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                  <span className="text-[10px] font-medium">{t.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {detail && <DetailSheet detail={detail} onClose={() => setDetail(null)} />}
      </div>
    </div>
  );
}
