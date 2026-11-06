import AsyncStorage from "@react-native-async-storage/async-storage";

import { STORAGE_KEYS } from "@/constants/storage";
import { useAuthStore } from "@/features/auth/auth-store";

describe("auth store", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useAuthStore.setState({ users: [], currentUser: null, hydrated: false });
  });

  it("registers a user, starts a session and stores only the password hash", async () => {
    await useAuthStore.getState().register("Alice", "secret123");

    const user = useAuthStore.getState().currentUser;
    expect(user).toMatchObject({ id: "test-user-id", username: "alice" });
    expect(user?.passwordHash).toBe("hash:secret123");
    expect(await AsyncStorage.getItem(STORAGE_KEYS.session)).toBe(
      '"test-user-id"',
    );
  });

  it("logs in an existing user and rejects invalid credentials", async () => {
    await useAuthStore.getState().register("alice", "secret123");
    await useAuthStore.getState().logout();

    await expect(
      useAuthStore.getState().login("alice", "wrong"),
    ).rejects.toThrow("Usuário ou senha inválidos.");
    await expect(
      useAuthStore.getState().login("ALICE", "secret123"),
    ).resolves.toBeUndefined();
    expect(useAuthStore.getState().currentUser?.username).toBe("alice");
  });
});
