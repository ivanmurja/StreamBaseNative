import React, { useCallback, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  RefreshControl,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { brandColors } from "../styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import FavoriteListItem from "../components/FavoriteListItem";

const FavoritesScreen = () => {
  const { getFavorites, removeFavorite } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const favorites = getFavorites();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simula uma recarga de dados
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderRightActions = (progress, dragX, item) => {
    const trans = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [0, 80],
      extrapolate: "clamp",
    });
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeFavorite(item.mediaType, item.id)}
      >
        <Animated.View style={{ transform: [{ translateX: trans }] }}>
          <Ionicons name="trash-outline" size={28} color="white" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderFavoriteItem = ({ item }) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item)
      }
      overshootRight={false}
    >
      <FavoriteListItem item={item} />
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => `${item.mediaType}_${item.id}`}
          ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={brandColors.primary}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="heart-dislike-outline"
            size={64}
            color={brandColors.textSecondary}
          />
          <Text style={styles.emptyText}>
            Sua lista de favoritos está vazia.
          </Text>
          <Text style={styles.emptySubText}>
            Clique no coração em um filme ou série para adicioná-lo aqui.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandColors.dark,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: brandColors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubText: {
    color: brandColors.textSecondary,
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#dc2626",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginVertical: 4,
    borderRadius: 8,
    marginRight: 16,
  },
});

export default FavoritesScreen;
