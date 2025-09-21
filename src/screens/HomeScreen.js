import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  ImageBackground,
  RefreshControl,
} from "react-native";
import tmdbApi, { TMDB_IMAGE_BASE_URL_ORIGINAL } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import { brandColors } from "../styles/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useHeaderHeight } from "@react-navigation/elements";

const HomeScreen = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const headerHeight = useHeaderHeight();

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await tmdbApi.get("/movie/popular");
      const formatted = response.data.results
        .filter((result) => result.poster_path)
        .map((result) => ({
          id: result.id,
          title: result.title || result.name,
          poster: result.poster_path,
          backdrop_path: result.backdrop_path,
          year:
            (result.release_date || result.first_air_date)?.substring(0, 4) ||
            "N/A",
          rating: result.vote_average ? result.vote_average.toFixed(1) : null,
          mediaType: "movie",
        }));
      setMovies(formatted);
      if (formatted.length > 0) {
        setFeaturedMovie(formatted[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMovies().then(() => setRefreshing(false));
  }, []);

  const HeroSection = () => {
    const backgroundUrl = featuredMovie
      ? `${TMDB_IMAGE_BASE_URL_ORIGINAL}${featuredMovie.backdrop_path}`
      : null;
    return (
      <View style={{ marginBottom: 16 }}>
        <ImageBackground
          source={{ uri: backgroundUrl }}
          style={[
            styles.heroContainer,
            { height: 300 + headerHeight, paddingTop: headerHeight },
          ]}
        >
          <LinearGradient
            colors={["rgba(13,17,23,0.2)", brandColors.dark]}
            style={styles.heroGradient}
          >
            <Text style={styles.heroTitle}>Descubra Novos Filmes</Text>
            <Text style={styles.heroSubtitle}>Os mais populares da semana</Text>
          </LinearGradient>
        </ImageBackground>
        <Text style={styles.listTitle}>Populares</Text>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={brandColors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        ListHeaderComponent={HeroSection}
        contentContainerStyle={{ paddingTop: headerHeight }}
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
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        style={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={brandColors.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandColors.dark,
    justifyContent: "center",
  },
  heroContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  heroGradient: {
    width: "100%",
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: brandColors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginHorizontal: 16,
    marginTop: -30,
  },
  list: {
    paddingHorizontal: 8,
  },
});

export default HomeScreen;
