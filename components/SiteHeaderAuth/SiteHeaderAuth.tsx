"use client";

import { MaterialIcon } from "@/components/MaterialIcon";
import { getMockAuthUser } from "@/lib/mock-auth";

type SiteHeaderAuthProps = {
  variant?: "desktop" | "mobile";
};

export function SiteHeaderAuth({ variant = "desktop" }: SiteHeaderAuthProps) {
  const user = getMockAuthUser();

  if (user) {
    const initial = user.displayName.trim().charAt(0).toUpperCase() || "?";

    if (variant === "mobile") {
      return (
        <button
          type="button"
          className="inline-flex items-center gap-2 font-label text-label text-primary-container"
          title="Личный кабинет — скоро"
          aria-label={`${user.displayName}, личный кабинет — скоро`}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-container/20 font-label text-label font-bold text-primary-container">
            {initial}
          </span>
          {user.displayName}
        </button>
      );
    }

    return (
      <button
        type="button"
        className="hidden items-center gap-2 rounded-full border border-outline-variant/50 bg-surface-container-high px-4 py-2 font-label text-label font-medium text-on-surface transition-all hover:border-primary-container/40 hover:bg-surface-container-highest active:scale-95 md:inline-flex"
        title="Личный кабинет — скоро"
        aria-label={`${user.displayName}, личный кабинет — скоро`}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-container font-label text-label font-bold text-on-primary-container">
          {initial}
        </span>
        <span className="max-w-[8rem] truncate">{user.displayName}</span>
      </button>
    );
  }

  if (variant === "mobile") {
    return (
      <button
        type="button"
        className="inline-flex items-center gap-1 font-label text-label text-primary-container"
        title="Вход — скоро"
      >
        <MaterialIcon name="login" className="text-[18px]" />
        Войти
      </button>
    );
  }

  return (
    <button
      type="button"
      className="hidden items-center gap-1 rounded-full bg-primary-container px-6 py-2 font-label text-label font-bold text-on-primary-container transition-all hover:shadow-accent-sm active:scale-95 md:inline-flex"
      title="Вход — скоро"
    >
      <MaterialIcon name="login" className="text-[20px]" />
      Войти
    </button>
  );
}
