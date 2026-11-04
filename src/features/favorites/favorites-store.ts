import { create } from "zustand";

import { STORAGE_KEYS } from "@/constants/storage";
import { readStorage, writeStorage } from "@/services/storage/async-storage";

type FavoritesState = {
  favorites: string[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  toggleFavorite: (word: string) => Promise<void>;
  isFavorite: (word: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  hydrated: false,
  hydrate: async () => {
    const favorites = await readStorage<string[]>(STORAGE_KEYS.favorites, []);
    set({ favorites, hydrated: true });
  },
  toggleFavorite: async (word) => {
    const normalized = word.toLowerCase();
    const favorites = get().favorites.includes(normalized)
      ? get().favorites.filter((item) => item !== normalized)
      : [...get().favorites, normalized];
    set({ favorites });
    await writeStorage(STORAGE_KEYS.favorites, favorites);
  },
  isFavorite: (word) => get().favorites.includes(word.toLowerCase()),
}));
