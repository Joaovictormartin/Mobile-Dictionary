import axios from "axios";

import {
  fetchWordDetails,
  fetchWordList,
} from "@/features/words/services/words-service";

jest.mock("axios");

const mockedAxios = jest.mocked(axios);

describe("words service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads, filters and sorts dictionary words", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { Zebra: "", "hello-world": "", apple: "", "123": "" },
    });

    await expect(fetchWordList()).resolves.toEqual(["apple", "zebra"]);
  });

  it("validates dictionary entries and exposes optional fields", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          word: "blue",
          phonetic: "/bluː/",
          phonetics: [
            { text: "/bluː/", audio: "https://audio.example/blue.mp3" },
          ],
          meanings: [
            {
              partOfSpeech: "adjective",
              definitions: [{ definition: "Having the colour of the sky." }],
            },
          ],
        },
      ],
    });

    await expect(fetchWordDetails("blue")).resolves.toMatchObject([
      { word: "blue", phonetic: "/bluː/" },
    ]);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://api.dictionaryapi.dev/api/v2/entries/en/blue",
    );
  });

  it("propagates API failures to the query layer", async () => {
    const error = new Error("Network unavailable");
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(fetchWordDetails("unknown")).rejects.toBe(error);
  });
});
