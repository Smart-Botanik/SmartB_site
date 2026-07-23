"use client";

import { MaterialIcon } from "@/components/MaterialIcon";
import type { GuidePreviewLayout } from "@/components/GuidePreviewCard";

type GuidesLayoutToggleProps = {
  layout: GuidePreviewLayout;
  onChange: (layout: GuidePreviewLayout) => void;
};

const OPTIONS: Array<{ value: GuidePreviewLayout; icon: string; label: string }> = [
  { value: "card", icon: "grid_view", label: "Карточки" },
  { value: "list", icon: "view_list", label: "Список" },
];

export function GuidesLayoutToggle({ layout, onChange }: GuidesLayoutToggleProps) {
  return (
    <div
      className="guide-layout-toggle inline-flex rounded-full border border-outline-variant/30 bg-surface-container-low p-1 dark:border-outline-variant/15"
      role="group"
      aria-label="Вид списка гайдов"
    >
      {OPTIONS.map(option => {
        const active = layout === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={
              active
                ? "inline-flex items-center gap-1.5 rounded-full bg-primary-container px-3 py-1.5 font-label text-[11px] uppercase tracking-wide text-on-primary-container"
                : "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-label text-[11px] uppercase tracking-wide text-on-surface-variant transition-colors hover:text-on-surface"
            }
            aria-pressed={active}
            title={option.label}
          >
            <MaterialIcon name={option.icon} className="text-[18px]" />
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
