import { graphqlRequest } from "./graphql";

export type CropKind = "TOMATO" | "ZUCCHINI" | "EGGPLANT" | "CUCUMBER";

export type ContentMedia = {
  id: string;
  url: string;
  width?: number | null;
  height?: number | null;
};

export type CropGuide = {
  id: string;
  cropKind: CropKind;
  slug: string;
  title: string;
  excerpt?: string | null;
  body: unknown;
  cover?: ContentMedia | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type SitePage = {
  id: string;
  key: string;
  title: string;
  sections: unknown;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

const GUIDE_FIELDS = `
  id
  cropKind
  slug
  title
  excerpt
  body
  cover { id url width height }
  seoTitle
  seoDescription
`;

const SITE_PAGE_FIELDS = `
  id
  key
  title
  sections
  seoTitle
  seoDescription
`;

export async function fetchPublishedSitePage(key: string) {
  const data = await graphqlRequest<{ publishedSitePage: SitePage | null }>(
    `query PublishedSitePage($key: String!) {
      publishedSitePage(key: $key) { ${SITE_PAGE_FIELDS} }
    }`,
    { key },
  );
  return data.publishedSitePage;
}

export async function fetchPublishedCropGuides(cropKind?: CropKind) {
  const data = await graphqlRequest<{ publishedCropGuides: CropGuide[] }>(
    `query PublishedCropGuides($cropKind: CropKind) {
      publishedCropGuides(cropKind: $cropKind) { ${GUIDE_FIELDS} }
    }`,
    cropKind ? { cropKind } : {},
  );
  return data.publishedCropGuides;
}

export async function fetchPublishedCropGuide(slug: string) {
  const data = await graphqlRequest<{ publishedCropGuide: CropGuide | null }>(
    `query PublishedCropGuide($slug: String!) {
      publishedCropGuide(slug: $slug) { ${GUIDE_FIELDS} }
    }`,
    { slug },
  );
  return data.publishedCropGuide;
}

export const CROP_KIND_LABELS: Record<CropKind, string> = {
  TOMATO: "Помидоры",
  ZUCCHINI: "Кабачки",
  EGGPLANT: "Баклажаны",
  CUCUMBER: "Огурцы",
};
