import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';

import { colors } from '@/theme/colors';
import { useRouter } from 'expo-router';

export function LoadingState({ label = 'Carregando...' }: { label?: string }) {
  return <Text style={styles.muted}>{label}</Text>;
}

export function EmptyState({ title,
  message }: { title: string; message: string }) {
  return (
    <View style={styles.center}>
      <MaterialIcons name="search-off" size={40} color={colors.accent} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.muted}>{message}</Text>
    </View>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { back } = useRouter();

  return (
    <View style={styles.center}>
      <Text style={styles.title}>Não foi possível carregar</Text>
      <Text style={styles.muted}>Verifique sua conexão e tente novamente.</Text>

      <Pressable onPress={onRetry} style={styles.retry}>
        <Text style={styles.retryText}>Tentar novamente</Text>
      </Pressable>
      <Pressable onPress={() => back()} style={styles.back}>
        <Text style={styles.retryText}>Voltar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  title: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center'
  },
  muted: {
    color: colors.muted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22
  },
  retry: {
    marginTop: 12,
    backgroundColor: colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12
  },
  retryText: {
    color: colors.surface,
    fontWeight: '700'
  },
  back: {
    marginTop: 5,
    backgroundColor: colors.muted,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12
  },
});
