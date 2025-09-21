import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { TMDB_IMAGE_BASE_URL } from "../api/tmdb";
import { brandColors } from "../styles/colors";
import { Ionicons } from "@expo/vector-icons";

const CastCard = ({ actor }) => {
  const imageUrl = actor.profile_path
    ? `${TMDB_IMAGE_BASE_URL}${actor.profile_path}`
    : null;

  return (
    <View style={styles.container}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="person" size={40} color={brandColors.textSecondary} />
        </View>
      )}
      <Text style={styles.name} numberOfLines={2}>
        {actor.name}
      </Text>
      <Text style={styles.character} numberOfLines={2}>
        {actor.character}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    marginRight: 12,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: brandColors.lightDark,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    color: brandColors.text,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
  },
  character: {
    color: brandColors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
});

export default CastCard;
