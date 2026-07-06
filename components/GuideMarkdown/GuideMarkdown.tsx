"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type GuideMarkdownProps = {
  markdown: string;
  className?: string;
};

export function GuideMarkdown({ markdown, className }: GuideMarkdownProps) {
  if (!markdown.trim()) return null;

  return (
    <div className={className ?? "guide-markdown"}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => <h2 className="guide-heading">{children}</h2>,
          h3: ({ children }) => <h3 className="guide-heading">{children}</h3>,
          p: ({ children }) => <p className="guide-paragraph">{children}</p>,
          blockquote: ({ children }) => (
            <aside className="guide-callout guide-callout-tip">{children}</aside>
          ),
          ul: ({ children }) => <ul className="guide-checklist">{children}</ul>,
          img: ({ src, alt }) =>
            src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={alt ?? ""} className="guide-markdown-image" />
            ) : null,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
