import type { ContentLabel } from "@/lib/content-api";

export type CulturePresentationPhoto = {
  url: string;
  alt?: string;
};

export type CulturePresentationBlockProps = {
  title: string;
  lead?: string;
  about?: string;
  photos?: CulturePresentationPhoto[];
  popularTags?: ContentLabel[];
  activeTagKey?: string;
  onSelectTag?: (tagKey: string) => void;
  onClearTag?: () => void;
};

export function CulturePresentationBlock({
  title,
  lead,
  about,
  photos = [],
  popularTags = [],
  activeTagKey,
  onSelectTag,
  onClearTag,
}: CulturePresentationBlockProps) {
  const visiblePhotos = photos.filter(photo => Boolean(photo.url)).slice(0, 4);

  return (
    <section className="culture-presentation" aria-label={`Презентация: ${title}`}>
      <div className="culture-presentation-copy">
        <h2 className="culture-presentation-title">{title}</h2>
        {lead ? <p className="culture-presentation-lead">{lead}</p> : null}
        {about ? <p className="culture-presentation-about">{about}</p> : null}

        {popularTags.length > 0 ? (
          <ul className="culture-presentation-tags" aria-label="Популярные метки">
            {popularTags.map(tag => {
              const isActive = activeTagKey === tag.key;
              return (
                <li key={tag.key}>
                  <button
                    type="button"
                    className={`culture-presentation-tag${
                      isActive ? " culture-presentation-tag-active" : ""
                    }`}
                    aria-pressed={isActive}
                    onClick={() => {
                      if (isActive) {
                        onClearTag?.();
                      } else {
                        onSelectTag?.(tag.key);
                      }
                    }}
                  >
                    {tag.label}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      {visiblePhotos.length > 0 ? (
        <div
          className={`culture-presentation-photos culture-presentation-photos--${Math.min(
            visiblePhotos.length,
            3,
          )}`}
        >
          {visiblePhotos.map((photo, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${photo.url}-${index}`}
              src={photo.url}
              alt={photo.alt ?? ""}
              className="culture-presentation-photo"
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
