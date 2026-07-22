export type JournalNewsArticle = {
  id: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  badge?: string;
};

export type JournalFeedEntry = {
  id: string;
  zone: string;
  zoneAccent: "mint" | "emerald" | "neutral";
  timeAgo: string;
  title: string;
  excerpt: string;
  verifiedBy?: string[];
};

export type CommunityStat = {
  icon: string;
  text: string;
};

export const JOURNAL_FEATURED: JournalNewsArticle = {
  id: "cherry-tomato-sync",
  category: "Исследование",
  badge: "Прорыв",
  date: "14 мая 2025",
  title: "Революция урожая: синхронизация питания cherry-томатов",
  excerpt:
    "Новые алгоритмы обратной связи показывают +24% к сахаристости при подаче питания в такт дыхательным циклам растения.",
  imageUrl:
    "https://images.unsplash.com/photo-1592924357224-548917444334?auto=format&fit=crop&w=1200&q=80",
  imageAlt: "Спелые cherry-томаты в теплице",
  href: "/guides",
};

export const JOURNAL_NEWS: JournalNewsArticle[] = [
  {
    id: "pest-prediction",
    category: "AI",
    date: "10 мая 2025",
    title: "Нейросети для прогноза вредителей 2.0",
    excerpt:
      "Модель компьютерного зрения выявляет грибковый стресс за 72 часа до видимых симптомов на листьях.",
    imageUrl:
      "https://images.unsplash.com/photo-1534723452862-4c874995d966?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Вертикальная ферма с LED-освещением",
    href: "/useful",
  },
  {
    id: "soil-probe",
    category: "Оборудование",
    date: "7 мая 2025",
    title: "Новые датчики влажности почвы",
    excerpt:
      "Датчики с низкой задержкой фиксируют сдвиги влажности и EC на уровне корневой зоны в реальном времени.",
    imageUrl:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Датчик в почве на грядке",
    href: "/guides",
  },
];

export const JOURNAL_FEED: JournalFeedEntry[] = [
  {
    id: "feed-1",
    zone: "Alpha-1",
    zoneAccent: "mint",
    timeAgo: "2 мин назад",
    title: "Баланс питания оптимизирован",
    excerpt:
      "Азот скорректирован до 240 ppm по анализу сока листа. Эффективность фотосинтеза +4%.",
    verifiedBy: ["JD", "ML"],
  },
  {
    id: "feed-2",
    zone: "Beta-3",
    zoneAccent: "emerald",
    timeAgo: "18 мин назад",
    title: "Началась фаза цветения",
    excerpt:
      "Красный спектр поднят до 80%. Влажность снижена до 45% для стимуляции завязи.",
  },
  {
    id: "feed-3",
    zone: "Gamma",
    zoneAccent: "neutral",
    timeAgo: "1 ч назад",
    title: "Аудит здоровья корней",
    excerpt: "Биометрика резервуара: патогенная активность не обнаружена.",
  },
  {
    id: "feed-4",
    zone: "Omega-7",
    zoneAccent: "mint",
    timeAgo: "4 ч назад",
    title: "Цикл сбора завершён",
    excerpt: "42 кг микрозелени обработано. Индекс качества: 9.8/10.",
  },
];

export const JOURNAL_COMMUNITY_STATS: CommunityStat[] = [
  { icon: "eco", text: "1 240 активных теплиц сегодня" },
  { icon: "trending_up", text: "+12% эффективности урожая в сети" },
];
