import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TMDB_IMAGE_BASE_URL } from "../api/tmdb";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { brandColors } from "../styles/colors";

const MovieCard = ({ id, poster, title, mediaType, rating, year }) => {
  const navigation = useNavigation();
  const imageUrl = poster
    ? `${TMDB_IMAGE_BASE_URL}${poster}`
    : "https://placehold.co/300x450/0d1117/c9d1d9?text=Imagem+Indisponivel";

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("Details", { mediaType, id })}
    >
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.poster}
        imageStyle={{ borderRadius: 8 }}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.8)", "rgba(0,0,0,0.95)"]}
          style={styles.gradient}
        >
          <View style={styles.infoContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            {year && <Text style={styles.year}>{year}</Text>}
          </View>
        </LinearGradient>

        <View style={styles.badgeContainer}>
          {mediaType && (
            <View style={[styles.badge, styles.mediaTypeBadge]}>
              <Text style={styles.badgeText}>
                {mediaType === "movie" ? "FILME" : "SÉRIE"}
              </Text>
            </View>
          )}
          {rating && parseFloat(rating) > 0 && (
            <View style={[styles.badge, styles.ratingBadge]}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.badgeText}>{rating}</Text>
            </View>
          )}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    backgroundColor: brandColors.lightDark,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  poster: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 8,
    justifyContent: "flex-end",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    justifyContent: "flex-end",
    padding: 10,
  },
  infoContainer: {
    justifyContent: "flex-end",
  },
  title: {
    color: brandColors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  year: {
    color: brandColors.textSecondary,
    fontSize: 12,
  },
  badgeContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    flexDirection: "row",
    alignItems: "center",
  },
  mediaTypeBadge: {},
  ratingBadge: {
    paddingLeft: 6,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 4,
  },
});

export default MovieCard;
