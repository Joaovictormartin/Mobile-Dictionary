import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';

import { colors } from '@/theme/colors';
import { queryClient } from '@/constants/query-client';
import { useAuthStore } from '@/features/auth/auth-store';
import { usePersistedStores } from '@/hooks/use-persisted-stores';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const hydrated = useAuthStore((state) => state.hydrated);
  const currentUser = useAuthStore((state) => state.currentUser);
  const hydrateAuth = useAuthStore((state) => state.hydrate);

  usePersistedStores();

  useEffect(() => {
    if (!hydrated) void hydrateAuth();
  }, [hydrateAuth, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const isAuthRoute = segments[0] === 'auth';

    if (!currentUser && !isAuthRoute) {
      router.replace('/auth/login');
    } else if (currentUser && isAuthRoute) {
      router.replace('/');
    }
  }, [currentUser, hydrated, router, segments]);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="word/[word]" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
      </Stack>
    </QueryClientProvider>
  );
}
