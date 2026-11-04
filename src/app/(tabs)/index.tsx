import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/theme/colors';
import { Screen } from '@/components/screen';
import { WordCard } from '@/components/word-card';
import { usePersistedStores } from '@/hooks/use-persisted-stores';
import { ErrorState, LoadingState } from '@/components/state-view';
import { useFavoritesStore } from '@/features/favorites/favorites-store';
import { useWordList, WORD_PAGE_SIZE } from '@/features/words/hooks/use-words';

export default function WordListScreen() {
  const router = useRouter();
  const hydrated = usePersistedStores();
  const { data, isLoading, isError, refetch } = useWordList();
  const favorites = useFavoritesStore((state) => state.favorites);

  const [search, setSearch] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(WORD_PAGE_SIZE);

  const words = data ?? [];
  const visibleWords = useMemo(
    () => words.filter((word) => word.includes(search.trim().toLowerCase())).slice(0, visibleCount),
    [search, visibleCount, words],
  );

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Dicionário de Inglês</Text>
          <Text style={styles.title}>Explore palavras</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>Descubra uma palavra nova todos os dias.</Text>

      <TextInput
        value={search}
        style={styles.search}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        placeholderTextColor={colors.muted}
        placeholder="Buscar uma palavra..."
        onChangeText={(value) => {
          setSearch(value);
          setVisibleCount(WORD_PAGE_SIZE);
        }}
      />

      {!hydrated || isLoading ? (
        <LoadingState label="Carregando palavras..." />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (
        <FlatList
          numColumns={3}
          data={visibleWords}
          onEndReachedThreshold={0.7}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.list}
          onEndReached={() => setVisibleCount((count) => count + WORD_PAGE_SIZE)}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhuma palavra encontrada para “{search}”.</Text>
          }
          renderItem={({ item }) => (
            <WordCard
              word={item}
              favorite={favorites.includes(item)}
              onPress={() => router.push(`/word/${item}`)}
            />
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 18,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: '800',
    marginTop: 5
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    marginTop: 7,
    marginBottom: 20
  },
  historyButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center'
  },
  historyIcon: {
    color: colors.accent,
    fontSize: 25
  },
  search: {
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 16,
    color: colors.ink,
    fontSize: 16,
    marginBottom: 12
  },
  list: {
    paddingBottom: 24
  },
  empty: {
    textAlign: 'center',
    color: colors.muted,
    marginTop: 32
  },
});
