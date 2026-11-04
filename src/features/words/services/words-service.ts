import axios from 'axios';
import { z } from 'zod';

import { DICTIONARY_API_URL, WORDS_URL } from '@/constants/api';
import type { DictionaryEntry } from '@/types/word';

const entrySchema = z.object({
  word: z.string(),
  phonetic: z.string().optional(),
  phonetics: z
    .array(z.object({ text: z.string().optional(), audio: z.string().optional() }))
    .default([]),
  meanings: z
    .array(
      z.object({
        partOfSpeech: z.string().optional(),
        definitions: z.array(
          z.object({
            definition: z.string(),
            example: z.string().optional(),
            synonyms: z.array(z.string()).optional(),
            antonyms: z.array(z.string()).optional(),
          }),
        ),
        synonyms: z.array(z.string()).optional(),
        antonyms: z.array(z.string()).optional(),
      }),
    )
    .default([]),
  origin: z.string().optional(),
});

export async function fetchWordList(): Promise<string[]> {
  const response = await axios.get<Record<string, string>>(WORDS_URL);
  return Object.keys(response.data)
    .filter((word) => /^[a-z]+$/i.test(word))
    .map((word) => word.toLowerCase())
    .sort();
}

export async function fetchWordDetails(word: string): Promise<DictionaryEntry[]> {
  const response = await axios.get(`${DICTIONARY_API_URL}/${encodeURIComponent(word)}`);
  return z.array(entrySchema).parse(response.data) as DictionaryEntry[];
}
