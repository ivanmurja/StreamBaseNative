import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Share,
  Platform,
  FlatList,
  Alert,
} from "react-native";
import tmdbApi, {
  TMDB_IMAGE_BASE_URL_ORIGINAL,
  TMDB_IMAGE_BASE_URL,
} from "../api/tmdb";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { brandColors } from "../styles/colors";
import { LinearGradient } from "expo-linear-gradient";
import CastCard from "../components/CastCard";

const DetailScreen = ({ route }) => {
  const { mediaType, id } = route.params;
  const { user, updateMediaState, getMediaStatus } = useAuth();
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  const mediaStatus = getMediaStatus(mediaType, id);

  useEffect(() => {
    const fetchAllDetails = async () => {
      try {
        const detailsPromise = tmdbApi.get(`/${mediaType}/${id}`);
        const creditsPromise = tmdbApi.get(`/${mediaType}/${id}/credits`);

        const [detailsResponse, creditsResponse] = await Promise.all([
          detailsPromise,
          creditsPromise,
        ]);

        setDetails(detailsResponse.data);
        setCast(creditsResponse.data.cast.slice(0, 10));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllDetails();
  }, [mediaType, id]);

  const handleFavorite = () => {
    if (!user) return;
    const mediaData = {
      id: details.id,
      title: details.title || details.name,
      poster: details.poster_path,
      mediaType: mediaType,
      year: (details.release_date || details.first_air_date)?.substring(0, 4),
    };
    updateMediaState(mediaData, { favorited: !mediaStatus.favorited });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Confira ${details.title || details.name} no StreamBase!`,
        url:
          details.homepage || `https://www.themoviedb.org/${mediaType}/${id}`,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={brandColors.primary}
        style={{ flex: 1, backgroundColor: brandColors.dark }}
      />
    );
  }

  if (!details) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Filme não encontrado.</Text>
      </View>
    );
  }

  const year = (details.release_date || details.first_air_date)?.substring(
    0,
    4
  );

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={{
          uri: `${TMDB_IMAGE_BASE_URL_ORIGINAL}${details.backdrop_path}`,
        }}
        style={styles.backdrop}
      >
        <LinearGradient
          colors={["transparent", "rgba(13,17,23,0.8)", brandColors.dark]}
          style={styles.backdropGradient}
        />
      </ImageBackground>

      <View style={styles.headerContainer}>
        <Image
          source={{ uri: `${TMDB_IMAGE_BASE_URL}${details.poster_path}` }}
          style={styles.poster}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>{details.title || details.name}</Text>
          <Text style={styles.tagline}>{details.tagline}</Text>
          <View style={styles.metaInfo}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" color="#FFD700" size={16} />
              <Text style={styles.ratingText}>
                {details.vote_average.toFixed(1)}
              </Text>
            </View>
            <Text style={styles.metaText}>{year}</Text>
            {details.runtime > 0 && (
              <Text style={styles.metaText}>{`${details.runtime} min`}</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        {user && (
          <TouchableOpacity
            onPress={handleFavorite}
            style={styles.actionButton}
          >
            <Ionicons
              name={mediaStatus.favorited ? "heart" : "heart-outline"}
              size={24}
              color={mediaStatus.favorited ? "#ef4444" : brandColors.text}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
          <Ionicons
            name={
              Platform.OS === "ios" ? "share-outline" : "share-social-outline"
            }
            size={24}
            color={brandColors.text}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Sinopse</Text>
        <Text style={styles.overview}>{details.overview}</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Elenco Principal</Text>
        <FlatList
          data={cast}
          renderItem={({ item }) => <CastCard actor={item} />}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 12 }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandColors.dark,
  },
  backdrop: {
    width: "100%",
    height: 250,
  },
  backdropGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContainer: {
    flexDirection: "row",
    marginTop: -100,
    paddingHorizontal: 20,
    alignItems: "flex-end",
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  tagline: {
    color: brandColors.textSecondary,
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 4,
    flexWrap: "wrap",
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    flexWrap: "wrap",
  },
  metaText: {
    color: brandColors.textSecondary,
    fontSize: 14,
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: "#FFD700",
    fontWeight: "bold",
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 24,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  overview: {
    color: brandColors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
});

export default DetailScreen;
