import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TMDB_IMAGE_BASE_URL } from "../api/tmdb";
import { brandColors } from "../styles/colors";
import { Ionicons } from "@expo/vector-icons";

const FavoriteListItem = ({ item }) => {
  const navigation = useNavigation();
  const imageUrl = item.poster
    ? `${TMDB_IMAGE_BASE_URL}${item.poster}`
    : "https://placehold.co/100x150/0d1117/c9d1d9?text=N/A";

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate("Details", {
          mediaType: item.mediaType,
          id: item.id,
        })
      }
    >
      <Image source={{ uri: imageUrl }} style={styles.poster} />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.year}>{item.year}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={24}
        color={brandColors.textSecondary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: brandColors.lightDark,
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 4,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  title: {
    color: brandColors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  year: {
    color: brandColors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
});

export default FavoriteListItem;
