import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { brandColors } from "../styles/colors";

const RegisterScreen = ({ navigation }) => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !displayName) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      await signup(displayName, email, password);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Erro", "Este e-mail já está em uso.");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      } else {
        Alert.alert("Erro", "Ocorreu um erro ao criar a conta.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Crie sua Conta</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome de Usuário"
          placeholderTextColor={brandColors.textSecondary}
          value={displayName}
          onChangeText={setDisplayName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={brandColors.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={brandColors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandColors.dark,
    justifyContent: "center",
    padding: 20,
  },
  content: {},
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 30,
    textAlign: "center",
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
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: brandColors.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: brandColors.primary,
    marginTop: 20,
    textAlign: "center",
  },
});

export default RegisterScreen;
