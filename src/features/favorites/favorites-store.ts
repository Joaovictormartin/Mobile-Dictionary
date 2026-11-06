import { create } from "zustand";

import { getUserStorageKey, STORAGE_KEYS } from "@/constants/storage";
import { readStorage, writeStorage } from "@/services/storage/async-storage";

type FavoritesState = {
  hydrated: boolean;
  favorites: string[];
  activeUserId: string | null;
  isFavorite: (word: string) => boolean;
  toggleFavorite: (word: string) => Promise<void>;
  hydrate: (userId: string | null) => Promise<void>;
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  activeUserId: null,
  hydrated: false,
  hydrate: async (userId) => {
    if (!userId) {
      set({ favorites: [], activeUserId: null, hydrated: true });
      return;
    }
    const favorites = await readStorage<string[]>(
      getUserStorageKey(STORAGE_KEYS.favorites, userId),
      [],
    );
    set({ favorites, activeUserId: userId, hydrated: true });
  },
  toggleFavorite: async (word) => {
    const userId = get().activeUserId;
    if (!userId) return;
    const normalized = word.toLowerCase();
    const favorites = get().favorites.includes(normalized)
      ? get().favorites.filter((item) => item !== normalized)
      : [...get().favorites, normalized];
    set({ favorites });
    await writeStorage(
      getUserStorageKey(STORAGE_KEYS.favorites, userId),
      favorites,
    );
  },
  isFavorite: (word) => get().favorites.includes(word.toLowerCase()),
}));
