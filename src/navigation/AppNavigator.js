import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import DetailScreen from "../screens/DetailScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";
import { brandColors } from "../styles/colors";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={stackNavigatorOptions}>
      <Stack.Screen
        name="HomeStack"
        component={HomeScreen}
        options={{
          title: "StreamBase",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="Details"
        component={DetailScreen}
        options={({ route }) => ({ title: route.params?.title || "Detalhes" })}
      />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={stackNavigatorOptions}>
      <Stack.Screen
        name="SearchStack"
        component={SearchScreen}
        options={{ title: "Buscar" }}
      />
      <Stack.Screen
        name="Details"
        component={DetailScreen}
        options={({ route }) => ({ title: route.params?.title || "Detalhes" })}
      />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator screenOptions={stackNavigatorOptions}>
      <Stack.Screen
        name="FavoritesStack"
        component={FavoritesScreen}
        options={{ title: "Meus Favoritos" }}
      />
      <Stack.Screen
        name="Details"
        component={DetailScreen}
        options={({ route }) => ({ title: route.params?.title || "Detalhes" })}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={stackNavigatorOptions}>
      <Stack.Screen
        name="ProfileStack"
        component={ProfileScreen}
        options={{ title: "Meu Perfil" }}
      />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator screenOptions={tabNavigatorOptions}>
      <Tab.Screen
        name="Início"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Buscar"
        component={SearchStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Favoritos"
        component={FavoritesStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: brandColors.dark,
        }}
      >
        <ActivityIndicator size="large" color={brandColors.primary} />
      </View>
    );
  }

  return user ? <AppTabs /> : <AuthStack />;
}

const stackNavigatorOptions = {
  headerStyle: { backgroundColor: brandColors.lightDark },
  headerTintColor: brandColors.text,
  headerTitleStyle: { fontWeight: "bold" },
};

const tabNavigatorOptions = {
  headerShown: false,
  tabBarActiveTintColor: brandColors.primary,
  tabBarInactiveTintColor: brandColors.textSecondary,
  tabBarStyle: {
    backgroundColor: brandColors.lightDark,
    borderTopColor: brandColors.border,
  },
};
