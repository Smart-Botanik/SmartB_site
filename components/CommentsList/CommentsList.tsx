"use client";

import {
  formatCommentDate,
  type CommentDto,
} from "@/lib/engagement";

type CommentsListProps = {
  comments: CommentDto[];
  title?: string;
  /** Show disabled composer placeholder (backend not ready). */
  showComposer?: boolean;
  className?: string;
};

export function CommentsList({
  comments,
  title = "Комментарии",
  showComposer = true,
  className = "",
}: CommentsListProps) {
  return (
    <section className={`comments-list ${className}`.trim()} aria-label={title}>
      <h3 className="comments-list-title">
        {title}
        <span className="comments-list-count">{comments.length}</span>
      </h3>

      {comments.length > 0 ? (
        <ul className="comments-list-items">
          {comments.map(comment => (
            <li key={comment.id} className="comments-list-item">
              <div className="comments-list-avatar" aria-hidden>
                {comment.author.displayName.slice(0, 1)}
              </div>
              <div className="comments-list-body">
                <div className="comments-list-meta">
                  <span className="comments-list-author">
                    {comment.author.displayName}
                  </span>
                  <time dateTime={comment.createdAt}>
                    {formatCommentDate(comment.createdAt)}
                  </time>
                </div>
                <p>{comment.body}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="comments-list-empty">Пока нет комментариев.</p>
      )}

      {showComposer ? (
        <div className="comments-list-composer" aria-disabled="true">
          <input
            type="text"
            disabled
            placeholder="Комментарии скоро — ждём API (BK-ENGAGE-1)"
            aria-label="Написать комментарий (скоро)"
          />
          <button type="button" disabled>
            Отправить
          </button>
        </div>
      ) : null}
    </section>
  );
}
