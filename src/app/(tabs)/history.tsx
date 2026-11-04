import { useRouter } from 'expo-router';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { Screen } from '@/components/screen';
import { EmptyState } from '@/components/state-view';
import { usePersistedStores } from '@/hooks/use-persisted-stores';
import { useHistoryStore } from '@/features/history/history-store';

export default function HistoryScreen() {
  const router = useRouter();
  const hydrated = usePersistedStores();
  const history = useHistoryStore((state) => state.history);

  if (!hydrated) return <Screen><Text style={styles.loading}>Carregando histórico...</Text></Screen>;

  return (
    <Screen>
      <Text style={styles.eyebrow}>Visto Recentemente</Text>
      <Text style={styles.title}>Histórico</Text>

      {history.length === 0 ? (
        <EmptyState title="Nada por aqui ainda" message="As palavras que você consultar aparecerão nesta lista." />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.word}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable style={styles.row} onPress={() => router.push(`/word/${item.word}`)}>
              <View>
                <Text style={styles.word}>{item.word}</Text>
                <Text style={styles.date}>{new Date(item.lastViewedAt).toLocaleString()}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={28} color={colors.accent} />
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
  date: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 5
  },
  arrow: {
    color: colors.accent,
    fontSize: 30
  },
  loading: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: 40
  },
});
