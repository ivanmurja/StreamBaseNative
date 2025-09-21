import axios from "axios";
import Constants from "expo-constants";

const { tmdbApiKey, omdbApiKey } = Constants.expoConfig.extra;

export const TMDB_API_KEY = tmdbApiKey;
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
export const TMDB_IMAGE_BASE_URL_ORIGINAL =
  "https://image.tmdb.org/t/p/original";

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: "pt-BR",
  },
});

export const OMDb_API_KEY = omdbApiKey;

export const omdbApi = axios.create({
  baseURL: "https://www.omdbapi.com/",
  params: {
    apikey: OMDb_API_KEY,
  },
});

export default tmdbApi;
