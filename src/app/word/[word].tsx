import { useEffect } from 'react';
import * as Speech from 'expo-speech';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { Screen } from '@/components/screen';
import { useWordDetails } from '@/features/words/hooks/use-words';
import { ErrorState, LoadingState } from '@/components/state-view';
import { useHistoryStore } from '@/features/history/history-store';
import { useFavoritesStore } from '@/features/favorites/favorites-store';

export default function WordDetailsScreen() {
  const { back } = useRouter();
  const { word: rawWord } = useLocalSearchParams<{ word: string }>();

  const word = Array.isArray(rawWord) ? rawWord[0] : rawWord;
  const { data, isLoading, isError, refetch } = useWordDetails(word);

  const registerWord = useHistoryStore((state) => state.registerWord);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(word));

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
    <Screen horizontalPadding={0}>
      <View style={styles.topBar}>
        <Pressable onPress={() => back()} style={styles.backButton}>
          <MaterialIcons
            size={24}
            name="arrow-back"
            color={colors.ink}
          />
        </Pressable>
        <Pressable onPress={() => void toggleFavorite(word)} style={styles.favoriteButton}>
          <MaterialIcons
            size={25}
            color={isFavorite ? colors.warm : colors.muted}
            name={isFavorite ? 'favorite' : 'favorite-border'}
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.wordPanel}>
          <Text style={styles.word}>{entry.word}</Text>

          {phonetic && <Text style={styles.phonetic}>{phonetic}</Text>}

          <Pressable
            style={styles.audio}
            accessibilityLabel="Ouvir pronúncia"
            onPress={() => audio ? void Speech.speak(entry.word, { language: 'en-US' }) : void Speech.speak(entry.word, { language: 'en-US' })}>
            <MaterialIcons
              size={24}
              name="play-arrow"
              color={colors.surface}
              style={styles.audioIcon}
            />
            <Text style={styles.audioText}>{audio ? 'Ouvir pronúncia' : 'Ouvir com síntese'}</Text>
          </Pressable>
        </View>

        {entry.origin && (
          <View style={styles.originBox}>
            <Text style={styles.label}>ORIGEM</Text>
            <Text style={styles.origin}>{entry.origin}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Significados</Text>

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
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 24
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  back: {
    color: colors.ink,
    fontSize: 34,
    lineHeight: 36
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 40
  },
  wordPanel: {
    backgroundColor: colors.accentSoft,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20
  },
  word: {
    color: colors.ink,
    fontSize: 38,
    fontWeight: '800'
  },
  phonetic: {
    color: colors.accent,
    fontSize: 19,
    marginTop: 8
  },
  audio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 22
  },
  audioIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    padding: 3,
    backgroundColor: colors.accent
  },
  audioText: {
    color: colors.accent,
    fontWeight: '700'
  },
  originBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 22,
    borderColor: colors.border,
    borderWidth: 1
  },
  label: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1
  },
  origin: {
    color: colors.ink,
    marginTop: 6,
    lineHeight: 22
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 25,
    fontWeight: '800',
    marginBottom: 12
  },
  meaning: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 17,
    marginBottom: 12,
    borderColor: colors.border,
    borderWidth: 1
  },
  partOfSpeech: {
    color: colors.accent,
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 11
  },
  definition: { marginBottom: 10 },

  definitionText: {
    color: colors.ink,
    lineHeight: 23,
    fontSize: 15
  },
  example: {
    color: colors.muted,
    fontStyle: 'italic',
    marginTop: 5,
    lineHeight: 21
  },
  related: {
    color: colors.muted,
    lineHeight: 21,
    marginTop: 4,
    fontSize: 13
  },
});
