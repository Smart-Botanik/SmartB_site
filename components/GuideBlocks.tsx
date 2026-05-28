import type { ContentMedia } from "@/lib/content-api";

type TBlock = Record<string, unknown>;

function isBlock(value: unknown): value is TBlock {
  return typeof value === "object" && value !== null && "type" in value;
}

function renderImageBlock(block: TBlock) {
  const url = typeof block.url === "string" ? block.url : null;
  const alt = typeof block.alt === "string" ? block.alt : "";
  if (!url) return null;
  return (
    <figure className="guide-block guide-block-image">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={alt} />
    </figure>
  );
}

export function GuideBlocks({ body }: { body: unknown }) {
  if (!Array.isArray(body)) {
    return null;
  }

  return (
    <div className="guide-blocks">
      {body.filter(isBlock).map((block, index) => {
        const key = `${String(block.type)}-${index}`;

        switch (block.type) {
          case "heading": {
            const level = block.level === 3 ? 3 : 2;
            const text = String(block.text ?? "");
            if (level === 3) {
              return (
                <h3 key={key} className="guide-heading">
                  {text}
                </h3>
              );
            }
            return (
              <h2 key={key} className="guide-heading">
                {text}
              </h2>
            );
          }
          case "paragraph":
            return (
              <p key={key} className="guide-paragraph">
                {String(block.text ?? "")}
              </p>
            );
          case "tip":
            return (
              <aside key={key} className="guide-callout guide-callout-tip">
                {String(block.text ?? "")}
              </aside>
            );
          case "warning":
            return (
              <aside key={key} className="guide-callout guide-callout-warning">
                {String(block.text ?? "")}
              </aside>
            );
          case "checklist": {
            const items = Array.isArray(block.items)
              ? block.items.map(item => String(item))
              : [];
            return (
              <ul key={key} className="guide-checklist">
                {items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          }
          case "image":
            return <div key={key}>{renderImageBlock(block)}</div>;
          default:
            return null;
        }
      })}
    </div>
  );
}

export function GuideCover({ cover }: { cover?: ContentMedia | null }) {
  if (!cover?.url) return null;
  return (
    <div className="guide-cover">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={cover.url} alt="" />
    </div>
  );
}
