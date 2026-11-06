export const STORAGE_KEYS = {
  users: "mobile-dictionary/users",
  session: "mobile-dictionary/session",
  history: "mobile-dictionary/history",
  favorites: "mobile-dictionary/favorites",
} as const;

export const getUserStorageKey = (key: string, userId: string) =>
  `${key}:${userId}`;
