import { Link, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/components/screen';
import { ErrorState, LoadingState } from '@/components/state-view';
import { WordCard } from '@/components/word-card';
import { useFavoritesStore } from '@/features/favorites/favorites-store';
import { useWordList, WORD_PAGE_SIZE } from '@/features/words/hooks/use-words';
import { usePersistedStores } from '@/hooks/use-persisted-stores';
import { colors } from '@/theme/colors';

export default function WordListScreen() {
  const router = useRouter();
  const hydrated = usePersistedStores();
  const { data, isLoading, isError, refetch } = useWordList();
  const favorites = useFavoritesStore((state) => state.favorites);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(WORD_PAGE_SIZE);

  const words = data ?? [];
  const visibleWords = useMemo(
    () => words.filter((word) => word.includes(search.trim().toLowerCase())).slice(0, visibleCount),
    [search, visibleCount, words],
  );

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>ENGLISH DICTIONARY</Text>
          <Text style={styles.title}>Explore palavras</Text>
        </View>
        <Link href="/history" asChild>
          <Pressable style={styles.historyButton}>
            <Text style={styles.historyIcon}>↺</Text>
          </Pressable>
        </Link>
      </View>
      <Text style={styles.subtitle}>Descubra uma palavra nova todos os dias.</Text>
      <TextInput
        value={search}
        onChangeText={(value) => {
          setSearch(value);
          setVisibleCount(WORD_PAGE_SIZE);
        }}
        placeholder="Buscar uma palavra..."
        placeholderTextColor={colors.muted}
        style={styles.search}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />
      {!hydrated || isLoading ? (
        <LoadingState label="Carregando palavras..." />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (
        <FlatList
          data={visibleWords}
          keyExtractor={(item) => item}
          numColumns={3}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <WordCard
              word={item}
              favorite={favorites.includes(item)}
              onPress={() => router.push(`/word/${item}`)}
            />
          )}
          onEndReached={() => setVisibleCount((count) => count + WORD_PAGE_SIZE)}
          onEndReachedThreshold={0.7}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhuma palavra encontrada para “{search}”.</Text>
          }
          ListFooterComponent={
            visibleWords.length < words.length ? (
              <LoadingState label="Carregando mais palavras..." />
            ) : undefined
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 18 },
  eyebrow: { color: colors.accent, fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: colors.ink, fontSize: 30, fontWeight: '800', marginTop: 5 },
  subtitle: { color: colors.muted, fontSize: 15, marginTop: 7, marginBottom: 20 },
  historyButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  historyIcon: { color: colors.accent, fontSize: 25 },
  search: { height: 52, borderRadius: 16, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, paddingHorizontal: 16, color: colors.ink, fontSize: 16, marginBottom: 12 },
  list: { paddingBottom: 24 },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 32 },
});
