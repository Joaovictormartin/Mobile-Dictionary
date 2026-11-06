import { useEffect } from "react";

import { useAuthStore } from "@/features/auth/auth-store";
import { useHistoryStore } from "@/features/history/history-store";
import { useFavoritesStore } from "@/features/favorites/favorites-store";

export function usePersistedStores() {
  const favoritesHydrated = useFavoritesStore((state) => state.hydrated);
  const historyHydrated = useHistoryStore((state) => state.hydrated);
  const authHydrated = useAuthStore((state) => state.hydrated);
  const currentUser = useAuthStore((state) => state.currentUser);
  const hydrateFavorites = useFavoritesStore((state) => state.hydrate);
  const hydrateHistory = useHistoryStore((state) => state.hydrate);

  useEffect(() => {
    if (!authHydrated) return;
    void hydrateFavorites(currentUser?.id ?? null);
    void hydrateHistory(currentUser?.id ?? null);
  }, [authHydrated, currentUser?.id, hydrateFavorites, hydrateHistory]);

  return authHydrated && favoritesHydrated && historyHydrated;
}
