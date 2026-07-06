import { TomatoIcon } from "./TomatoIcon";

type TFactImage = {
  url?: string;
  alt?: string;
};

type TFactItem = {
  title?: string;
  text?: string;
  image?: TFactImage;
  iconVariant?: "red" | "green" | "orange" | "cherry";
};

type GuideFactCardsProps = {
  title?: string;
  subtitle?: string;
  heroImage?: TFactImage;
  items?: TFactItem[];
};

const ICON_VARIANTS: Array<"red" | "green" | "orange" | "cherry"> = [
  "red",
  "cherry",
  "orange",
  "green",
  "red",
  "cherry",
  "orange",
  "green",
  "red",
  "orange",
  "cherry",
  "green",
];

function parseItems(raw: unknown): TFactItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(item => typeof item === "object" && item !== null) as TFactItem[];
}

export function GuideFactCards({
  title,
  subtitle,
  heroImage,
  items: rawItems,
}: GuideFactCardsProps) {
  const items = parseItems(rawItems);
  if (items.length === 0) return null;

  return (
    <section className="guide-fact-cards" aria-labelledby="guide-fact-cards-title">
      <div className="guide-fact-cards-header">
        <div className="guide-fact-cards-header-text">
          <div className="guide-fact-cards-kicker">
            <TomatoIcon variant="red" className="guide-fact-cards-kicker-icon" />
            <span>Знаете ли вы?</span>
          </div>
          {title ? (
            <h2 id="guide-fact-cards-title" className="guide-fact-cards-title">
              {title}
            </h2>
          ) : null}
          {subtitle ? <p className="guide-fact-cards-subtitle">{subtitle}</p> : null}
        </div>
        {heroImage?.url ? (
          <figure className="guide-fact-cards-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage.url} alt={heroImage.alt ?? ""} loading="lazy" />
          </figure>
        ) : null}
      </div>

      <ol className="guide-fact-cards-grid">
        {items.map((item, index) => {
          const iconVariant =
            item.iconVariant ?? ICON_VARIANTS[index % ICON_VARIANTS.length];

          return (
            <li key={`${item.title ?? "fact"}-${index}`} className="guide-fact-card">
              <div className="guide-fact-card-top">
                <span className="guide-fact-card-number">{index + 1}</span>
                <TomatoIcon variant={iconVariant} className="guide-fact-card-icon" />
              </div>

              {item.image?.url ? (
                <figure className="guide-fact-card-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image.url}
                    alt={item.image.alt ?? item.title ?? ""}
                    loading="lazy"
                  />
                </figure>
              ) : null}

              <div className="guide-fact-card-body">
                {item.title ? <h3 className="guide-fact-card-title">{item.title}</h3> : null}
                {item.text ? <p className="guide-fact-card-text">{item.text}</p> : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
