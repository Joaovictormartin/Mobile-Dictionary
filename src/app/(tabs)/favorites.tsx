import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text } from 'react-native';

import { colors } from '@/theme/colors';
import { Screen } from '@/components/screen';
import { WordCard } from '@/components/word-card';
import { EmptyState } from '@/components/state-view';
import { usePersistedStores } from '@/hooks/use-persisted-stores';
import { useFavoritesStore } from '@/features/favorites/favorites-store';

export default function FavoritesScreen() {
  const router = useRouter();
  const hydrated = usePersistedStores();
  const favorites = useFavoritesStore((state) => state.favorites);

  if (!hydrated) return <Screen><Text style={styles.loading}>Carregando favoritos...</Text></Screen>;

  return (
    <Screen>
      <Text style={styles.eyebrow}>Sua Coleção</Text>
      <Text style={styles.title}>Favoritos</Text>

      {favorites.length === 0 ? (
        <EmptyState title="Sua coleção está vazia" message="Toque na estrela de uma palavra para salvá-la aqui." />
      ) : (
        <FlatList
          data={favorites}
          numColumns={3}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <WordCard word={item} favorite onPress={() => router.push(`/word/${item}`)} />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginTop: 18
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: '800',
    marginTop: 5,
    marginBottom: 20
  },
  list: {
    paddingBottom: 24
  },
  loading: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: 40
  },
});
