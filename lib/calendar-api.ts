import { graphqlRequest } from "./graphql";

export type CalendarActivityKind =
  | "LANDING"
  | "CARE"
  | "HARVEST"
  | "WATERING"
  | "NUTRIENTS";

export type CalendarFavorability = "FAVORABLE" | "NEUTRAL" | "UNFAVORABLE";

export type PublishedCalendarDayMark = {
  id: string;
  taxonomyTagId: string;
  activityKind: CalendarActivityKind;
  favorability: CalendarFavorability;
  note?: string | null;
};

export type PublishedCalendarDay = {
  id: string;
  date: string;
  title?: string | null;
  bodyMd: string;
  moonPhase?: string | null;
  moonZodiacSign?: string | null;
  status: string;
  publishedAt?: string | null;
  cultureMarks: PublishedCalendarDayMark[];
};

export type PublishedCalendarDayListItem = {
  id: string;
  date: string;
  title?: string | null;
  moonPhase?: string | null;
  moonZodiacSign?: string | null;
  status: string;
  publishedAt?: string | null;
};

const DAY_FIELDS = `
  id
  date
  title
  bodyMd
  moonPhase
  moonZodiacSign
  status
  publishedAt
  cultureMarks {
    id
    taxonomyTagId
    activityKind
    favorability
    note
  }
`;

const LIST_FIELDS = `
  id
  date
  title
  moonPhase
  moonZodiacSign
  status
  publishedAt
`;

const QUERY_PUBLISHED_CALENDAR_DAY = `
  query PublishedCalendarDay($date: String!) {
    publishedCalendarDay(date: $date) {
      ${DAY_FIELDS}
    }
  }
`;

const QUERY_PUBLISHED_CALENDAR_DAYS = `
  query PublishedCalendarDays($from: String!, $to: String!) {
    publishedCalendarDays(from: $from, to: $to) {
      ${LIST_FIELDS}
    }
  }
`;

function isNotFoundError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /not found/i.test(message);
}

/** Public day detail (title, body, marks, ephemeris cache). Null if unpublished. */
export async function fetchPublishedCalendarDay(
  date: string,
): Promise<PublishedCalendarDay | null> {
  try {
    const data = await graphqlRequest<{
      publishedCalendarDay: PublishedCalendarDay | null;
    }>(QUERY_PUBLISHED_CALENDAR_DAY, { date }, { revalidate: false });
    return data.publishedCalendarDay ?? null;
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }
    throw error;
  }
}

/** Compact published days for a month range (YYYY-MM-DD). Empty on failure. */
export async function fetchPublishedCalendarDays(
  from: string,
  to: string,
): Promise<PublishedCalendarDayListItem[]> {
  try {
    const data = await graphqlRequest<{
      publishedCalendarDays: PublishedCalendarDayListItem[];
    }>(QUERY_PUBLISHED_CALENDAR_DAYS, { from, to }, { revalidate: false });
    return data.publishedCalendarDays ?? [];
  } catch {
    return [];
  }
}
