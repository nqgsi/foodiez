import { fetchProfile } from "@/api/profile";
import AuthContext from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useContext } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  background: "#DED7C6",
  primary: "#7A9E7E",
  accent: "#D35400",
  text: "#4E342E",
  white: "#FFFFFF",
  card: "#EFE9DA",
};

const ProfileScreen = () => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("userId");
    setIsAuthenticated(false);
    router.dismissTo("/");
  };

  if (isLoading)
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        size="large"
        color={COLORS.primary}
      />
    );

  if (isError || !user) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <Text style={{ fontSize: 20, marginBottom: 20, color: COLORS.text }}>
          You don't have an account ☹️
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/signup")}
          style={{
            backgroundColor: COLORS.primary,
            padding: 14,
            borderRadius: 14,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "800",
            color: COLORS.text,
            marginBottom: 20,
          }}
        >
          Profile
        </Text>
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          {user.image ? (
            <Image
              source={{ uri: `http://172.20.10.5:8000/uploads/${user.image}` }}
              style={{ width: 120, height: 120, borderRadius: 60 }}
            />
          ) : (
            <Text style={{ fontSize: 40 }}>👤</Text>
          )}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: COLORS.text,
              marginTop: 10,
            }}
          >
            {user.username}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: COLORS.text,
            marginBottom: 10,
          }}
        >
          Published Recipes: {user.recipes?.length || 0}
        </Text>

        {user.recipes && user.recipes.length > 0 ? (
          user.recipes.map((recipe: any) => (
            <View
              key={recipe._id}
              style={{
                flexDirection: "row",
                marginBottom: 12,
                backgroundColor: COLORS.white,
                borderRadius: 14,
                padding: 12,
              }}
            >
              {recipe.image && (
                <Image
                  source={{
                    uri: `http://172.20.10.5:8000/uploads/${recipe.image}`,
                  }}
                  style={{ width: 74, height: 74, borderRadius: 12 }}
                />
              )}
              <View style={{ justifyContent: "center", marginLeft: 12 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: COLORS.text,
                  }}
                >
                  {recipe.title}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text
              style={{ fontSize: 16, color: COLORS.text, marginBottom: 12 }}
            >
              You don’t have any recipes yet ☹️
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/recipes")} // adjust route if needed
              style={{
                backgroundColor: COLORS.primary,
                padding: 14,
                borderRadius: 14,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
                Make your first recipe
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            marginTop: 20,
            backgroundColor: COLORS.accent,
            padding: 14,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
