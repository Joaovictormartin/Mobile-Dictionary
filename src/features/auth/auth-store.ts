import * as Crypto from "expo-crypto";
import { create } from "zustand";

import { STORAGE_KEYS } from "@/constants/storage";
import { readStorage, writeStorage } from "@/services/storage/async-storage";

export type AuthUser = {
  id: string;
  username: string;
  passwordHash: string;
};

type AuthState = {
  users: AuthUser[];
  hydrated: boolean;
  currentUser: AuthUser | null;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
};

async function hashPassword(password: string) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password,
  );
}

export const useAuthStore = create<AuthState>((set, get) => ({
  users: [],
  currentUser: null,
  hydrated: false,
  hydrate: async () => {
    const users = await readStorage<AuthUser[]>(STORAGE_KEYS.users, []);
    const sessionId = await readStorage<string | null>(
      STORAGE_KEYS.session,
      null,
    );
    set({
      users,
      currentUser: users.find((user) => user.id === sessionId) ?? null,
      hydrated: true,
    });
  },
  register: async (username, password) => {
    const normalizedUsername = username.trim().toLowerCase();
    if (normalizedUsername.length < 3)
      throw new Error("O usuário deve ter pelo menos 3 caracteres.");
    if (password.length < 6)
      throw new Error("A senha deve ter pelo menos 6 caracteres.");
    if (get().users.some((user) => user.username === normalizedUsername)) {
      throw new Error("Este usuário já está cadastrado.");
    }

    const user = {
      id: Crypto.randomUUID(),
      username: normalizedUsername,
      passwordHash: await hashPassword(password),
    };
    const users = [...get().users, user];
    await writeStorage(STORAGE_KEYS.users, users);
    await writeStorage(STORAGE_KEYS.session, user.id);
    set({ users, currentUser: user });
  },
  login: async (username, password) => {
    const normalizedUsername = username.trim().toLowerCase();
    const passwordHash = await hashPassword(password);
    const user = get().users.find(
      (candidate) =>
        candidate.username === normalizedUsername &&
        candidate.passwordHash === passwordHash,
    );
    if (!user) throw new Error("Usuário ou senha inválidos.");

    await writeStorage(STORAGE_KEYS.session, user.id);
    set({ currentUser: user });
  },
  logout: async () => {
    await writeStorage(STORAGE_KEYS.session, null);
    set({ currentUser: null });
  },
}));
