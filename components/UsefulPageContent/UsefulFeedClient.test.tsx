import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UsefulFeedClient } from "./UsefulFeedClient";
import type { UsefulFeedPost } from "./useful-feed";

const MOCK_POSTS: UsefulFeedPost[] = [
  {
    id: "post.guide.1",
    type: "guide",
    title: "Тестовый Гайд",
    body: "Описание гайда",
    authorName: "Гайд",
    metaLabel: "Гайд",
    sortAt: 1000,
  },
  {
    id: "post.video.1",
    type: "video",
    title: "Тестовое Видео",
    body: "Описание видео",
    authorName: "Видео",
    metaLabel: "Видео",
    sortAt: 900,
  },
  {
    id: "post.image.1",
    type: "image",
    title: "Тестовое Фото",
    body: "Описание фото",
    authorName: "Фото",
    metaLabel: "Фото",
    sortAt: 800,
  },
  {
    id: "post.source.1",
    type: "source",
    title: "Тестовый Источник",
    body: "Описание источника",
    authorName: "Источник",
    metaLabel: "Источник",
    sortAt: 700,
  },
];

describe("UsefulFeedClient Component", () => {
  it("renders header and default 'all' filter with all posts", () => {
    render(<UsefulFeedClient posts={MOCK_POSTS} />);

    expect(screen.getByRole("heading", { name: "Интересное" })).toBeInTheDocument();
    
    // Check all posts are rendered in default state
    expect(screen.getByText("Тестовый Гайд")).toBeInTheDocument();
    expect(screen.getByText("Тестовое Видео")).toBeInTheDocument();
    expect(screen.getByText("Тестовое Фото")).toBeInTheDocument();
    expect(screen.getByText("Тестовый Источник")).toBeInTheDocument();
  });

  it("filters posts by 'guide' (includes guide & source posts)", () => {
    render(<UsefulFeedClient posts={MOCK_POSTS} />);

    // Click 'Гайды' filter button in sidebar nav
    const guideNavBtns = screen.getAllByRole("button", { name: /Гайды/i });
    fireEvent.click(guideNavBtns[0]);

    // Guides & Sources should be visible
    expect(screen.getByText("Тестовый Гайд")).toBeInTheDocument();
    expect(screen.getByText("Тестовый Источник")).toBeInTheDocument();

    // Video & Image should be filtered out
    expect(screen.queryByText("Тестовое Видео")).not.toBeInTheDocument();
    expect(screen.queryByText("Тестовое Фото")).not.toBeInTheDocument();
  });

  it("filters posts by 'video'", () => {
    render(<UsefulFeedClient posts={MOCK_POSTS} />);

    const videoNavBtns = screen.getAllByRole("button", { name: /Видео/i });
    fireEvent.click(videoNavBtns[0]);

    expect(screen.getByText("Тестовое Видео")).toBeInTheDocument();
    expect(screen.queryByText("Тестовый Гайд")).not.toBeInTheDocument();
    expect(screen.queryByText("Тестовое Фото")).not.toBeInTheDocument();
  });

  it("shows empty state when no posts match filter", () => {
    const onlyGuidePosts: UsefulFeedPost[] = [
      {
        id: "post.guide.1",
        type: "guide",
        title: "Тестовый Гайд",
        authorName: "Гайд",
        metaLabel: "Гайд",
        sortAt: 1000,
      },
    ];

    render(<UsefulFeedClient posts={onlyGuidePosts} />);

    const videoNavBtns = screen.getAllByRole("button", { name: /Видео/i });
    fireEvent.click(videoNavBtns[0]);

    expect(screen.getByText(/Пока нет материалов в этом фильтре/i)).toBeInTheDocument();
  });
});
