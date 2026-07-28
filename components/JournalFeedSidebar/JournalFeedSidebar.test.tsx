import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { JournalFeedSidebar } from "./JournalFeedSidebar";
import type { CommunityStat, JournalFeedEntry } from "@/lib/journal-content";

const MOCK_FEED: JournalFeedEntry[] = [
  {
    id: "feed-1",
    zone: "Гидропоника",
    zoneAccent: "mint",
    title: "Цикл томатов на подходе",
    excerpt: "Первые плоды созрели",
    timeAgo: "2 ч назад",
    verifiedBy: ["АВ", "ЕК"],
  },
  {
    id: "feed-2",
    zone: "Органика",
    zoneAccent: "emerald",
    title: "Эксперимент с мульчированием",
    excerpt: "Почва держит влагу",
    timeAgo: "5 ч назад",
  },
];

const MOCK_STATS: CommunityStat[] = [
  {
    icon: "eco",
    text: "120 активных циклов",
  },
  {
    icon: "groups",
    text: "450 экспертов",
  },
];

describe("JournalFeedSidebar Component", () => {
  it("renders live feed title and Live badge", () => {
    render(<JournalFeedSidebar feed={MOCK_FEED} communityStats={MOCK_STATS} />);

    expect(screen.getByRole("heading", { name: "Лента циклов" })).toBeInTheDocument();
    expect(screen.getByText(/Live/i)).toBeInTheDocument();
  });

  it("renders feed entries with zone badge and title", () => {
    render(<JournalFeedSidebar feed={MOCK_FEED} communityStats={MOCK_STATS} />);

    expect(screen.getByText("Гидропоника")).toBeInTheDocument();
    expect(screen.getByText("Цикл томатов на подходе")).toBeInTheDocument();
    expect(screen.getByText("Подтверждено 2 экспертами")).toBeInTheDocument();

    expect(screen.getByText("Органика")).toBeInTheDocument();
    expect(screen.getByText("Эксперимент с мульчированием")).toBeInTheDocument();
  });

  it("renders community stats section", () => {
    render(<JournalFeedSidebar feed={MOCK_FEED} communityStats={MOCK_STATS} />);

    expect(screen.getByRole("heading", { name: "Пульс сообщества" })).toBeInTheDocument();
    expect(screen.getByText("120 активных циклов")).toBeInTheDocument();
    expect(screen.getByText("450 экспертов")).toBeInTheDocument();
  });

  it("renders link to full feed", () => {
    render(<JournalFeedSidebar feed={MOCK_FEED} communityStats={MOCK_STATS} />);

    const fullFeedLink = screen.getByRole("link", { name: /Вся лента/i });
    expect(fullFeedLink).toHaveAttribute("href", "/journal");
  });
});
