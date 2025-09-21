import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { brandColors } from "../styles/colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = () => {
  const {
    user,
    logout,
    updateUserProfile,
    updateUserEmail,
    sendPasswordReset,
    getFavorites,
  } = useAuth();

  const [profileImage, setProfileImage] = useState(null);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const favorites = getFavorites();
  const favoriteMovies = favorites.filter(
    (item) => item.mediaType === "movie"
  ).length;
  const favoriteSeries = favorites.filter(
    (item) => item.mediaType === "tv"
  ).length;

  const selectImage = () => {
    Alert.alert("Alterar Foto de Perfil", "Escolha uma opção", [
      { text: "Tirar Foto...", onPress: takePhoto },
      { text: "Escolher da Galeria...", onPress: pickImageFromLibrary },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Desculpe, precisamos da permissão de câmera para isso funcionar!"
      );
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const pickImageFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Desculpe, precisamos da permissão para acessar suas fotos para isso funcionar!"
      );
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleProfileUpdate = async () => {
    if (!displayName) {
      Alert.alert("Erro", "O nome de usuário não pode ficar em branco.");
      return;
    }
    setLoading(true);
    try {
      if (displayName !== user.displayName)
        await updateUserProfile(displayName);
      if (email !== user.email) await updateUserEmail(email);
      Alert.alert("Sucesso", "Perfil atualizado!");
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erro",
        "Não foi possível atualizar o perfil. Tente fazer login novamente e repita o processo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = () => {
    sendPasswordReset()
      .then(() =>
        Alert.alert(
          "Verifique seu E-mail",
          "Enviamos um link para você redefinir sua senha."
        )
      )
      .catch((error) => {
        console.error(error);
        Alert.alert("Erro", "Não foi possível enviar o e-mail de redefinição.");
      });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair. Tente novamente.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={selectImage}
        accessible
        accessibilityLabel="Selecionar imagem de perfil"
        accessibilityHint="Abre as opções para alterar a foto de perfil"
      >
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Ionicons
            name="person-circle-outline"
            size={120}
            color={brandColors.primary}
          />
        )}
        <View style={styles.editIconContainer}>
          <Ionicons name="pencil" size={18} color={brandColors.dark} />
        </View>
      </TouchableOpacity>

      <Text style={styles.label}>Nome de Usuário</Text>
      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Seu nome de usuário"
        placeholderTextColor={brandColors.textSecondary}
        accessible
        accessibilityLabel="Campo de nome de usuário"
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Seu e-mail"
        placeholderTextColor={brandColors.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
        accessible
        accessibilityLabel="Campo de e-mail"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleProfileUpdate}
        disabled={loading}
        accessible
        accessibilityLabel="Salvar alterações"
        accessibilityHint="Salva as alterações feitas no perfil"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        )}
      </TouchableOpacity>

      <View style={styles.dashboardContainer}>
        <Text style={styles.dashboardTitle}>Dashboard de Favoritos</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{favoriteMovies}</Text>
            <Text style={styles.statLabel}>Filmes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{favoriteSeries}</Text>
            <Text style={styles.statLabel}>Séries</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={handlePasswordReset}
        accessible
        accessibilityLabel="Alterar senha"
        accessibilityHint="Envia um e-mail para redefinição de senha"
      >
        <Text style={styles.linkButtonText}>Alterar Senha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        accessible
        accessibilityLabel="Sair"
        accessibilityHint="Desconecta o usuário do aplicativo"
      >
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: brandColors.dark,
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: brandColors.primary,
    borderWidth: 2,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: brandColors.primary,
    padding: 8,
    borderRadius: 15,
  },
  label: {
    color: brandColors.textSecondary,
    alignSelf: "flex-start",
    marginTop: 20,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: brandColors.lightDark,
    borderRadius: 8,
    paddingHorizontal: 15,
    color: "white",
    borderWidth: 1,
    borderColor: brandColors.border,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: brandColors.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 20,
  },
  linkButtonText: {
    color: brandColors.primary,
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    borderRadius: 8,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  dashboardContainer: {
    width: "100%",
    marginTop: 30,
    padding: 15,
    backgroundColor: brandColors.lightDark,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: brandColors.border,
  },
  dashboardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    color: brandColors.primary,
    fontSize: 28,
    fontWeight: "bold",
  },
  statLabel: {
    color: brandColors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
});

export default ProfileScreen;
