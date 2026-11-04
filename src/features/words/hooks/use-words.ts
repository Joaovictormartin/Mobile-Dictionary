import { useQuery } from "@tanstack/react-query";

import {
  fetchWordDetails,
  fetchWordList,
} from "@/features/words/services/words-service";

export const WORD_PAGE_SIZE = 60;

export function useWordList() {
  return useQuery({
    queryKey: ["word-list"],
    queryFn: fetchWordList,
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useWordDetails(word: string) {
  return useQuery({
    queryKey: ["word", word.toLowerCase()],
    queryFn: () => fetchWordDetails(word),
    enabled: Boolean(word),
  });
}
