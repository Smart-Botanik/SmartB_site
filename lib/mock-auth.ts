export type SiteAuthUser = {
  id: string;
  displayName: string;
};

/**
 * Мок авторизации для header site.
 * Задайте NEXT_PUBLIC_MOCK_AUTH_USER (имя) — покажется кнопка пользователя вместо «Войти».
 * В будущем заменить на реальную сессию / личный кабинет.
 */
export function getMockAuthUser(): SiteAuthUser | null {
  const displayName = process.env.NEXT_PUBLIC_MOCK_AUTH_USER?.trim();
  if (!displayName) {
    return null;
  }

  return {
    id: "mock-user",
    displayName,
  };
}
