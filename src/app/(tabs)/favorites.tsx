import { useRouter } from 'expo-router';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { Screen } from '@/components/screen';
import { EmptyState } from '@/components/state-view';
import { usePersistedStores } from '@/hooks/use-persisted-stores';
import { useFavoritesStore } from '@/features/favorites/favorites-store';

export default function FavoritesScreen() {
  const router = useRouter();
  const hydrated = usePersistedStores();
  const favorites = useFavoritesStore((state) => state.favorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const confirmRemove = (word: string) => {
    Alert.alert(
      'Remover favorito?',
      `Deseja remover "${word}" da sua lista de favoritos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => void toggleFavorite(word),
        },
      ],
    );
  };

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
          keyExtractor={(item) => item}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable style={styles.row} onPress={() => router.push(`/word/${item}`)}>
              <View>
                <Text style={styles.word}>{item}</Text>
              </View>
              <Pressable
                accessibilityLabel={`Excluir ${item} dos favoritos`}
                hitSlop={8}
                onPress={(event) => {
                  event.stopPropagation();
                  confirmRemove(item);
                }}>
                <MaterialIcons name="delete-outline" size={24} color={colors.danger} />
              </Pressable>
            </Pressable>
          )}
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
    gap: 10,
    paddingBottom: 24
  },
  row: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  word: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700'
  },
  loading: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: 40
  },
});
