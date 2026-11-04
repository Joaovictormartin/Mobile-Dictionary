import * as Speech from 'expo-speech';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ErrorState, LoadingState } from '@/components/state-view';
import { useFavoritesStore } from '@/features/favorites/favorites-store';
import { useHistoryStore } from '@/features/history/history-store';
import { useWordDetails } from '@/features/words/hooks/use-words';
import { colors } from '@/theme/colors';

export default function WordDetailsScreen() {
  const router = useRouter();
  const { word: rawWord } = useLocalSearchParams<{ word: string }>();
  const word = Array.isArray(rawWord) ? rawWord[0] : rawWord;
  const { data, isLoading, isError, refetch } = useWordDetails(word);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(word));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const registerWord = useHistoryStore((state) => state.registerWord);

  useEffect(() => {
    if (word) void registerWord(word);
  }, [registerWord, word]);

  if (isLoading) {
    return <View style={styles.center}><LoadingState label="Consultando dicionário..." /></View>;
  }
  if (isError || !data?.length) {
    return <View style={styles.center}><ErrorState onRetry={() => void refetch()} /></View>;
  }

  const entry = data[0];
  const phonetic = entry.phonetic ?? entry.phonetics.find((item) => item.text)?.text;
  const audio = entry.phonetics.find((item) => item.audio)?.audio;

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <Pressable onPress={() => void toggleFavorite(word)} style={styles.favoriteButton}>
          <Text style={[styles.favorite, isFavorite && styles.favoriteActive]}>{isFavorite ? '★' : '☆'}</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.wordPanel}>
          <Text style={styles.word}>{entry.word}</Text>
          {phonetic && <Text style={styles.phonetic}>{phonetic}</Text>}
          <Pressable
            accessibilityLabel="Ouvir pronúncia"
            style={styles.audio}
            onPress={() => audio ? void Speech.speak(entry.word, { language: 'en-US' }) : void Speech.speak(entry.word, { language: 'en-US' })}>
            <Text style={styles.audioIcon}>▶</Text>
            <Text style={styles.audioText}>{audio ? 'Ouvir pronúncia' : 'Ouvir com síntese'}</Text>
          </Pressable>
        </View>
        {entry.origin && (
          <View style={styles.originBox}>
            <Text style={styles.label}>ORIGEM</Text>
            <Text style={styles.origin}>{entry.origin}</Text>
          </View>
        )}
        <Text style={styles.sectionTitle}>Meanings</Text>
        {entry.meanings.map((meaning, meaningIndex) => (
          <View key={`${meaning.partOfSpeech}-${meaningIndex}`} style={styles.meaning}>
            {meaning.partOfSpeech && <Text style={styles.partOfSpeech}>{meaning.partOfSpeech}</Text>}
            {meaning.definitions.map((definition, definitionIndex) => (
              <View key={`${definition.definition}-${definitionIndex}`} style={styles.definition}>
                <Text style={styles.definitionText}>{definitionIndex + 1}. {definition.definition}</Text>
                {definition.example && <Text style={styles.example}>“{definition.example}”</Text>}
              </View>
            ))}
            {!!meaning.synonyms?.length && <Text style={styles.related}>Sinônimos: {meaning.synonyms.join(', ')}</Text>}
            {!!meaning.antonyms?.length && <Text style={styles.related}>Antônimos: {meaning.antonyms.join(', ')}</Text>}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 24 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  back: { color: colors.ink, fontSize: 34, lineHeight: 36 },
  favoriteButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  favorite: { color: colors.muted, fontSize: 27 },
  favoriteActive: { color: colors.warm },
  content: { padding: 20, paddingTop: 12, paddingBottom: 40 },
  wordPanel: { backgroundColor: colors.accentSoft, borderRadius: 24, padding: 24, marginBottom: 20 },
  word: { color: colors.ink, fontSize: 38, fontWeight: '800' },
  phonetic: { color: colors.accent, fontSize: 19, marginTop: 8 },
  audio: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 22 },
  audioIcon: { width: 30, height: 30, borderRadius: 15, overflow: 'hidden', textAlign: 'center', paddingTop: 5, color: colors.surface, backgroundColor: colors.accent, fontSize: 13 },
  audioText: { color: colors.accent, fontWeight: '700' },
  originBox: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 22, borderColor: colors.border, borderWidth: 1 },
  label: { color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1.1 },
  origin: { color: colors.ink, marginTop: 6, lineHeight: 22 },
  sectionTitle: { color: colors.ink, fontSize: 25, fontWeight: '800', marginBottom: 12 },
  meaning: { backgroundColor: colors.surface, borderRadius: 18, padding: 17, marginBottom: 12, borderColor: colors.border, borderWidth: 1 },
  partOfSpeech: { color: colors.accent, fontWeight: '800', fontSize: 16, marginBottom: 11 },
  definition: { marginBottom: 10 },
  definitionText: { color: colors.ink, lineHeight: 23, fontSize: 15 },
  example: { color: colors.muted, fontStyle: 'italic', marginTop: 5, lineHeight: 21 },
  related: { color: colors.muted, lineHeight: 21, marginTop: 4, fontSize: 13 },
});
