export type WordMeaning = {
  partOfSpeech?: string;
  definitions: Array<{
    definition: string;
    example?: string;
    synonyms?: string[];
    antonyms?: string[];
  }>;
  synonyms?: string[];
  antonyms?: string[];
};

export type DictionaryEntry = {
  word: string;
  phonetic?: string;
  phonetics: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: WordMeaning[];
  origin?: string;
};

export type HistoryItem = {
  word: string;
  lastViewedAt: string;
};
