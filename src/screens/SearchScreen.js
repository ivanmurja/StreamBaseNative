import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from "react-native";
import tmdbApi from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import { brandColors } from "../styles/colors";
import { Ionicons } from "@expo/vector-icons";

const SearchScreen = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await tmdbApi.get("/search/multi", {
          params: { query, include_adult: false },
        });

        const formatted = response.data.results
          .filter(
            (result) =>
              result.poster_path &&
              (result.media_type === "movie" || result.media_type === "tv")
          )
          .map((result) => ({
            id: result.id,
            title: result.title || result.name,
            poster: result.poster_path,
            year:
              (result.release_date || result.first_air_date)?.substring(0, 4) ||
              "N/A",
            rating: result.vote_average ? result.vote_average.toFixed(1) : null,
            mediaType: result.media_type,
          }));
        setResults(formatted);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const searchTimeout = setTimeout(fetchResults, 500);
    return () => clearTimeout(searchTimeout);
  }, [query]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Ionicons
          name="search"
          size={20}
          color={brandColors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchBar}
          placeholder="Busque por um filme ou série..."
          placeholderTextColor={brandColors.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoFocus={true}
        />
      </View>

      {loading && (
        <ActivityIndicator size="large" color={brandColors.primary} />
      )}

      {!loading && (
        <FlatList
          data={results}
          renderItem={({ item }) => (
            <MovieCard
              id={item.id}
              poster={item.poster}
              title={item.title}
              mediaType={item.mediaType}
              rating={item.rating}
              year={item.year}
            />
          )}
          keyExtractor={(item) => `${item.mediaType}_${item.id}`}
          numColumns={2}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandColors.dark,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: brandColors.lightDark,
    borderRadius: 25,
    margin: 16,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: brandColors.border,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    height: 50,
    color: "white",
    flex: 1,
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 8,
  },
});

export default SearchScreen;
