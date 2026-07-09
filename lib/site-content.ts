export type GrowReportCard = {
  id: string;
  title: string;
  excerpt: string;
  badge: string;
  journalNote: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
};

export type KnowledgeChapter = {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: "mint" | "gold" | "emerald" | "neutral";
  tags: string[];
  href: string;
};

export type GuideArticlePreview = {
  id: string;
  title: string;
  excerpt: string;
  icon: string;
  href: string;
  section: "growing" | "preserving" | "reports" | "interesting";
};

export const HOME_GROW_REPORTS: GrowReportCard[] = [
  {
    id: "tomato-report",
    title: "Гроу-репорт: помидоры Cherry",
    excerpt:
      "Indoor-цикл на кокосе: от проращивания до первого сбора. Датчики влажности и PAR каждые 15 минут.",
    badge: "Активный цикл",
    journalNote: "Скачок роста после корректировки питания на 3-й неделе.",
    imageUrl:
      "https://images.unsplash.com/photo-1592924357224-548917444334?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Спелые помидоры в теплице",
    href: "/guides#reports",
  },
  {
    id: "cucumber-report",
    title: "Гроу-репорт: огурцы Gherkin",
    excerpt:
      "Вертикальная грядка, капельный полив и контроль EC. От цветения до стабильного урожая за 6 недель.",
    badge: "Сбор сегодня",
    journalNote: "Началась фаза активного цветения, планируем подвязку.",
    imageUrl:
      "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Свежие огурцы на грядке",
    href: "/guides#reports",
  },
];

export const HOME_KNOWLEDGE_CHAPTERS: KnowledgeChapter[] = [
  {
    id: "growing",
    title: "Выращивание",
    description:
      "Субстраты, освещение, полив и питание — от рассады до стабильного урожая.",
    icon: "🌱",
    accent: "mint",
    tags: ["Гидропоника", "Освещение", "Почвы"],
    href: "/guides#growing",
  },
  {
    id: "preserving",
    title: "Закрутка",
    description:
      "Консервирование, ферментация и хранение — как сохранить урожай на зиму.",
    icon: "🫙",
    accent: "gold",
    tags: ["Маринование", "Сушка", "Хранение"],
    href: "/guides#preserving",
  },
  {
    id: "reports",
    title: "Репорты",
    description:
      "Публичные гроу-репорты с заметками, метриками и фото по неделям цикла.",
    icon: "📊",
    accent: "emerald",
    tags: ["Дневник", "Метрики", "Фото"],
    href: "/guides#reports",
  },
  {
    id: "interesting",
    title: "Полезное",
    description:
      "Подборки, эксперименты и истории из сообщества — без строгих инструкций.",
    icon: "💡",
    accent: "neutral",
    tags: ["Сообщество", "Эксперименты", "Обзоры"],
    href: "/guides#interesting",
  },
];

export const GUIDES_GROWING_ARTICLES: GuideArticlePreview[] = [
  {
    id: "soil-secrets",
    title: "Секреты субстрата",
    excerpt:
      "Ризосфера, микроэлементы и pH — как подготовить почву или кокос под конкретную культуру.",
    icon: "layers",
    href: "/guides",
    section: "growing",
  },
  {
    id: "light-management",
    title: "Управление светом",
    excerpt:
      "PAR, спектр и фотопериод для LED-систем в плотных посадках и теплицах.",
    icon: "light_mode",
    href: "/guides",
    section: "growing",
  },
  {
    id: "watering-schedules",
    title: "Графики полива",
    excerpt:
      "Полив по датчикам влажности: меньше переливов, меньше стресса для корней.",
    icon: "water_drop",
    href: "/guides",
    section: "growing",
  },
  {
    id: "nutrition-basics",
    title: "Питание растений",
    excerpt:
      "NPK, микроэлементы и EC — базовая схема подкормок на вегетации и цветении.",
    icon: "science",
    href: "/guides",
    section: "growing",
  },
  {
    id: "seedlings",
    title: "Рассада без сюрпризов",
    excerpt:
      "Проращивание, пикировка и закаливание перед пересадкой в основной субстрат.",
    icon: "spa",
    href: "/guides",
    section: "growing",
  },
  {
    id: "climate-control",
    title: "Микроклимат",
    excerpt:
      "Температура, влажность и вентиляция — три параметра, которые нельзя игнорировать.",
    icon: "thermostat",
    href: "/guides",
    section: "growing",
  },
];

export const GUIDES_PRESERVING_ARTICLES: GuideArticlePreview[] = [
  {
    id: "glass-jars",
    title: "Банки и стерилизация",
    excerpt:
      "Как выбрать ёмкости и подготовить их для длительного хранения без потери питательности.",
    icon: "kitchen",
    href: "/guides#preserving",
    section: "preserving",
  },
  {
    id: "pickled-cucumbers",
    title: "Маринованные огурцы",
    excerpt: "Классический рассол, укроп и перец — пошаговый протокол ферментации.",
    icon: "lunch_dining",
    href: "/guides#preserving",
    section: "preserving",
  },
  {
    id: "tomato-sauce",
    title: "Томатные соусы",
    excerpt:
      "Массовая заготовка после урожая: от бланширования до автоклавирования.",
    icon: "soup_kitchen",
    href: "/guides#preserving",
    section: "preserving",
  },
  {
    id: "drying-herbs",
    title: "Сушка зелени",
    excerpt: "Базилик, петрушка и укроп — сушка при низкой температуре без потери аромата.",
    icon: "dehydrate",
    href: "/guides#preserving",
    section: "preserving",
  },
];

export const GUIDES_REPORTS_ARTICLES: GuideArticlePreview[] = [
  {
    id: "report-cherry-tomato",
    title: "Cherry indoor — 8 недель",
    excerpt: "Полный цикл на кокосе с еженедельными замерами EC и температуры.",
    icon: "monitoring",
    href: "/guides#reports",
    section: "reports",
  },
  {
    id: "report-gherkin",
    title: "Огурцы на вертикали",
    excerpt: "Вертикальная грядка, капельный полив, фото каждую неделю.",
    icon: "photo_camera",
    href: "/guides#reports",
    section: "reports",
  },
  {
    id: "report-pepper",
    title: "Перец в тенте",
    excerpt: "Первый опыт с LED 240W: ошибки, исправления и итоговый урожай.",
    icon: "local_fire_department",
    href: "/guides#reports",
    section: "reports",
  },
];

export const GUIDES_INTERESTING_ARTICLES: GuideArticlePreview[] = [
  {
    id: "community-picks",
    title: "Лучшее из Telegram",
    excerpt: "Еженедельная подборка вопросов и находок из нашего канала.",
    icon: "forum",
    href: "/guides#interesting",
    section: "interesting",
  },
  {
    id: "experiments",
    title: "Эксперимент: CO₂-буст",
    excerpt: "Что изменилось в скорости роста при +400 ppm CO₂ в закрытом боксе.",
    icon: "biotech",
    href: "/guides#interesting",
    section: "interesting",
  },
  {
    id: "gear-review",
    title: "Обзор pH-метра",
    excerpt: "Три бюджетных прибора — точность, калибровка и удобство в поле.",
    icon: "build",
    href: "/guides#interesting",
    section: "interesting",
  },
  {
    id: "season-planning",
    title: "План сезона 2026",
    excerpt: "Как распределить культуры по месяцам в средней полосе.",
    icon: "calendar_month",
    href: "/guides#interesting",
    section: "interesting",
  },
];
