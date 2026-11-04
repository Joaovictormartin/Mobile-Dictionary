import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';

import { colors } from '@/theme/colors';

interface WordCardProps {
  word: string;
  favorite: boolean;
  onPress: () => void;
}

export const WordCard = memo(function WordCard({
  word,
  favorite,
  onPress,
}: WordCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Text style={styles.word}>{word}</Text>
      {favorite && <MaterialIcons name="star" size={18} color={colors.warm} style={styles.star} />}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 72,
    margin: 5,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }]
  },
  word: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700'
  },
  star: {
    position: 'absolute',
    top: 8,
    right: 10
  },
});
