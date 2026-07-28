import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { JournalNewsSection } from "./JournalNewsSection";
import type { JournalNewsArticle } from "@/lib/journal-content";

const MOCK_FEATURED: JournalNewsArticle = {
  id: "featured-1",
  title: "Главная новость журнала",
  excerpt: "Описание главного материала",
  category: "Обновления",
  date: "15 июля 2026",
  href: "/journal/featured-1",
  imageUrl: "/images/featured.jpg",
  imageAlt: "Главная новость",
  badge: "Релиз",
};

const MOCK_ARTICLES: JournalNewsArticle[] = [
  {
    id: "article-1",
    title: "Второстепенная статья 1",
    excerpt: "Краткий анонс статьи 1",
    category: "Опыт",
    date: "10 июля 2026",
    href: "/journal/article-1",
    imageUrl: "/images/article1.jpg",
    imageAlt: "Статья 1",
  },
  {
    id: "article-2",
    title: "Второстепенная статья 2",
    excerpt: "Краткий анонс статьи 2",
    category: "Советы",
    date: "5 июля 2026",
    href: "/journal/article-2",
    imageUrl: "/images/article2.jpg",
    imageAlt: "Статья 2",
  },
];

describe("JournalNewsSection Component", () => {
  it("renders section title and nav buttons", () => {
    render(<JournalNewsSection featured={MOCK_FEATURED} articles={MOCK_ARTICLES} />);

    expect(screen.getByRole("heading", { name: "Новости и обновления" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Предыдущая новость" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Следующая новость" })).toBeInTheDocument();
  });

  it("renders featured article content and link", () => {
    render(<JournalNewsSection featured={MOCK_FEATURED} articles={MOCK_ARTICLES} />);

    expect(screen.getByText("Главная новость журнала")).toBeInTheDocument();
    expect(screen.getByText("Описание главного материала")).toBeInTheDocument();
    expect(screen.getByText("Релиз")).toBeInTheDocument();

    const featuredLink = screen.getByRole("link", { name: /Главная новость журнала/i });
    expect(featuredLink).toHaveAttribute("href", "/journal/featured-1");
  });

  it("renders articles list with categories and links", () => {
    render(<JournalNewsSection featured={MOCK_FEATURED} articles={MOCK_ARTICLES} />);

    expect(screen.getByText("Второстепенная статья 1")).toBeInTheDocument();
    expect(screen.getByText("Второстепенная статья 2")).toBeInTheDocument();
    expect(screen.getByText("Опыт")).toBeInTheDocument();
    expect(screen.getByText("Советы")).toBeInTheDocument();
  });
});
