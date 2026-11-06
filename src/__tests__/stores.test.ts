import AsyncStorage from "@react-native-async-storage/async-storage";

import { useHistoryStore } from "@/features/history/history-store";
import { getUserStorageKey, STORAGE_KEYS } from "@/constants/storage";
import { useFavoritesStore } from "@/features/favorites/favorites-store";

describe("favorites and history stores", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useFavoritesStore.setState({
      favorites: [],
      activeUserId: "user-1",
      hydrated: false,
    });
    useHistoryStore.setState({
      history: [],
      activeUserId: "user-1",
      hydrated: false,
    });
  });

  it("adds and removes favorites without duplicates", async () => {
    await useFavoritesStore.getState().toggleFavorite("Blue");
    await useFavoritesStore.getState().toggleFavorite("blue");

    expect(useFavoritesStore.getState().favorites).toEqual([]);

    await useFavoritesStore.getState().toggleFavorite("Blue");
    expect(useFavoritesStore.getState().favorites).toEqual(["blue"]);
    expect(
      await AsyncStorage.getItem(
        getUserStorageKey(STORAGE_KEYS.favorites, "user-1"),
      ),
    ).toBe('["blue"]');
  });

  it("hydrates favorites from local storage", async () => {
    await AsyncStorage.setItem(
      getUserStorageKey(STORAGE_KEYS.favorites, "user-1"),
      JSON.stringify(["blue"]),
    );

    await useFavoritesStore.getState().hydrate("user-1");

    expect(useFavoritesStore.getState().favorites).toEqual(["blue"]);
    expect(useFavoritesStore.getState().hydrated).toBe(true);
  });

  it("keeps each user's favorites isolated", async () => {
    await useFavoritesStore.getState().toggleFavorite("blue");
    await useFavoritesStore.getState().hydrate("user-2");

    expect(useFavoritesStore.getState().favorites).toEqual([]);

    await useFavoritesStore.getState().hydrate("user-1");
    expect(useFavoritesStore.getState().favorites).toEqual(["blue"]);
  });

  it("registers a word once and moves it to the most recent position", async () => {
    await useHistoryStore.getState().registerWord("blue");
    await useHistoryStore.getState().registerWord("green");
    await useHistoryStore.getState().registerWord("blue");

    expect(useHistoryStore.getState().history).toHaveLength(2);
    expect(useHistoryStore.getState().history[0].word).toBe("blue");
    expect(
      await AsyncStorage.getItem(
        getUserStorageKey(STORAGE_KEYS.history, "user-1"),
      ),
    ).toContain('"blue"');
  });
});
