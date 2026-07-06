import Link from "next/link";

import { GuidesKnowledgeSections } from "@/components/GuidesKnowledgeSections";
import { MaterialIcon } from "@/components/MaterialIcon";
import {
  CROP_KIND_LABELS,
  CROP_KIND_SLUGS,
  DEFAULT_CROP_ORDER,
  fetchPublishedCropGuides,
  sortPublishedGuides,
} from "@/lib/content-api";
import { partitionGuidesByKnowledgeSection } from "@/lib/guide-sections";

export const revalidate = 3600;

export default async function GuidesPage() {
  let guidesBySection = partitionGuidesByKnowledgeSection([]);

  try {
    const guides = sortPublishedGuides(await fetchPublishedCropGuides());
    guidesBySection = partitionGuidesByKnowledgeSection(guides);
  } catch {
    /* пустые разделы — placeholder в UI */
  }

  return (
    <div className="mx-auto max-w-container-max px-gutter pb-20 pt-16">
      <div className="relative mb-12">
        <div className="hero-gradient absolute inset-0 -z-10" />
        <div className="mb-2 flex flex-col gap-1">
          <span className="font-label text-label uppercase tracking-widest text-primary-fixed-dim">
            База знаний
          </span>
          <h1 className="font-display text-display text-primary md:text-[64px] md:leading-tight">
            Гайды и материалы
          </h1>
        </div>
        <p className="max-w-2xl font-body text-on-surface-variant">
          Выращивание, закрутка, репорты и подборки — всё для цикла от семени до банки.
          Выберите раздел или культуру ниже.
        </p>
      </div>

      <nav className="mb-12 flex flex-wrap gap-2" aria-label="Разделы базы знаний">
        {[
          { href: "#growing", label: "Выращивание" },
          { href: "#preserving", label: "Закрутка" },
          { href: "#reports", label: "Репорты" },
          { href: "#interesting", label: "Интересное" },
        ].map(item => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-full border border-outline-variant/30 bg-surface-container-low px-4 py-2 text-sm text-on-surface-variant transition-colors hover:border-primary-container hover:text-primary-container"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <nav className="mb-12 flex flex-wrap gap-2" aria-label="Культуры">
        {DEFAULT_CROP_ORDER.map(kind => (
          <Link
            key={kind}
            href={`/guides/kultury/${CROP_KIND_SLUGS[kind]}`}
            className="inline-flex items-center gap-1 rounded-full border border-outline-variant/30 bg-surface-container px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:border-primary-container hover:text-primary-container"
          >
            <MaterialIcon name="eco" className="text-[16px] text-primary-fixed-dim" />
            {CROP_KIND_LABELS[kind]}
          </Link>
        ))}
      </nav>

      <GuidesKnowledgeSections guidesBySection={guidesBySection} />
    </div>
  );
}
