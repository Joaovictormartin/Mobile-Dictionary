import { useEffect } from 'react';

import { useFavoritesStore } from '@/features/favorites/favorites-store';
import { useHistoryStore } from '@/features/history/history-store';

export function usePersistedStores() {
  const favoritesHydrated = useFavoritesStore((state) => state.hydrated);
  const historyHydrated = useHistoryStore((state) => state.hydrated);
  const hydrateFavorites = useFavoritesStore((state) => state.hydrate);
  const hydrateHistory = useHistoryStore((state) => state.hydrate);

  useEffect(() => {
    void hydrateFavorites();
    void hydrateHistory();
  }, [hydrateFavorites, hydrateHistory]);

  return favoritesHydrated && historyHydrated;
}
