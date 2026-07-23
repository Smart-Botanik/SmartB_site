"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { GuideCultureHub } from "./GuideCultureHub";
import type { ContentLabel, CropGuide, CropKind } from "@/lib/content-api";
import type { GuideLinkVariant } from "@/lib/guide-view-paths";
import { filterGuidesByLabelKey } from "@/lib/tag-surface";

type GuideCultureHubStaticProps = {
  cropKind?: CropKind | null;
  cultureLabel: string;
  cultureSlug: string;
  allGuides: CropGuide[];
  variant?: GuideLinkVariant;
  hubLead?: string;
  aboutShort?: string;
  heroPreviewUrl?: string | null;
  labelFilters?: ContentLabel[];
};

function GuideCultureHubStaticInner(props: GuideCultureHubStaticProps) {
  const searchParams = useSearchParams();
  const activeLabelKey = searchParams.get("label") ?? undefined;
  const guides = useMemo(
    () => filterGuidesByLabelKey(props.allGuides, activeLabelKey),
    [props.allGuides, activeLabelKey],
  );

  return (
    <GuideCultureHub
      {...props}
      guides={guides}
      allGuides={props.allGuides}
      activeLabelKey={activeLabelKey}
    />
  );
}

/** Culture hub with client-side `?label=` filtering (static export safe). */
export function GuideCultureHubStatic(props: GuideCultureHubStaticProps) {
  return (
    <Suspense
      fallback={
        <GuideCultureHub
          {...props}
          guides={props.allGuides}
          allGuides={props.allGuides}
        />
      }
    >
      <GuideCultureHubStaticInner {...props} />
    </Suspense>
  );
}
