import type { CropKind } from "./content-api";
import { DEFAULT_CROP_ORDER } from "./content-api";

export type HeroSection = {
  type: "hero";
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type CultureChipsSection = {
  type: "cultureChips";
  title?: string;
  subtitle?: string;
  cropKinds?: CropKind[];
};

export type CtaSection = {
  type: "ctaBlock";
  title?: string;
  text?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type TelegramBlockSection = {
  type: "telegramBlock";
  title?: string;
  text?: string;
  channelUrl?: string;
  buttonLabel?: string;
};

export type ParsedHomeSections = {
  hero: Partial<HeroSection>;
  cultureChips: CultureChipsSection | null;
  ctaBlock: CtaSection | null;
  telegramBlock: TelegramBlockSection | null;
};

const CROP_KIND_SET = new Set<string>(DEFAULT_CROP_ORDER);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseCropKinds(value: unknown): CropKind[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const kinds = value.filter(
    (item): item is CropKind => typeof item === "string" && CROP_KIND_SET.has(item),
  );

  return kinds.length > 0 ? kinds : undefined;
}

export function parseHomeSections(sections: unknown): ParsedHomeSections {
  const result: ParsedHomeSections = {
    hero: {},
    cultureChips: null,
    ctaBlock: null,
    telegramBlock: null,
  };

  if (!Array.isArray(sections)) {
    return result;
  }

  for (const section of sections.filter(isRecord)) {
    switch (section.type) {
      case "hero":
        result.hero = section as HeroSection;
        break;
      case "cultureChips":
        result.cultureChips = {
          type: "cultureChips",
          title: typeof section.title === "string" ? section.title : undefined,
          subtitle: typeof section.subtitle === "string" ? section.subtitle : undefined,
          cropKinds: parseCropKinds(section.cropKinds),
        };
        break;
      case "ctaBlock":
        result.ctaBlock = section as CtaSection;
        break;
      case "telegramBlock":
        result.telegramBlock = {
          type: "telegramBlock",
          title: typeof section.title === "string" ? section.title : undefined,
          text: typeof section.text === "string" ? section.text : undefined,
          channelUrl: typeof section.channelUrl === "string" ? section.channelUrl : undefined,
          buttonLabel: typeof section.buttonLabel === "string" ? section.buttonLabel : undefined,
        };
        break;
      default:
        break;
    }
  }

  return result;
}

export function resolveCultureChipsSection(
  section: CultureChipsSection | null,
): CultureChipsSection {
  return (
    section ?? {
      type: "cultureChips",
      title: "Культуры",
      subtitle: "Гайды и материалы по основным культурам — от рассады до урожая.",
    }
  );
}

export function resolveTelegramBlockSection(
  section: TelegramBlockSection | null,
  fallbackChannelUrl: string,
): TelegramBlockSection {
  return {
    type: "telegramBlock",
    title: section?.title ?? "Telegram-канал SmartБотanik",
    text:
      section?.text ??
      "Короткие советы, анонсы новых статей и ссылки на полные руководства на сайте.",
    channelUrl: section?.channelUrl ?? fallbackChannelUrl,
    buttonLabel: section?.buttonLabel ?? "Подписаться на канал",
  };
}
