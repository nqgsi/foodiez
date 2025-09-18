import { fetchProfile } from "@/api/profile";
import { deleteRecipe } from "@/api/recipes";
import AuthContext from "@/context/auth-context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import debounce from "lodash.debounce";
import React, { useCallback, useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  RefreshControl,
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
type Recipe = {
  _id: string;
  title: string;
  image?: string;
  description?: string;
  user: User | null;
  ingredients: { _id: string; name: string }[];
  categories: { _id: string; name: string }[];
};
type UsersAndRecipes = {
  users: User[];
  recipes: Recipe[];
};
type User = {
  _id: string;
  username: string;
  image?: string;
};
// ... all your imports above

const ProfileScreen = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | any>(null);

  const { mutate: removeRecipe, isPending: deleting } = useMutation({
    mutationFn: (id: string) => deleteRecipe(id),
    onSuccess: () => {
      refetch();
    },
    onError: (err) => {
      console.error("Delete failed", err);
    },
  });

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const handleRefresh = useCallback(
    debounce(async () => {
      setRefreshing(true);
      await refetch();
      setRefreshing(false);
    }, 500),
    [refetch]
  );

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
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "800",
            color: COLORS.text,
            marginBottom: 20,
          }}
        >
          Profile👤
        </Text>
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          {user.image ? (
            <Image
              source={{
                uri: `http://192.168.14.27:8000/uploads/${user.image}`,
              }}
              style={{ width: 120, height: 120, borderRadius: 60 }}
            />
          ) : (
            <Text style={{ fontSize: 40 }}>🧑🏻</Text>
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
            <TouchableOpacity
              key={recipe._id}
              onPress={() => setSelectedRecipe(recipe)}
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
                    uri: `http://192.168.14.27:8000/uploads/${recipe.image}`,
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
            </TouchableOpacity>
          ))
        ) : (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text
              style={{ fontSize: 16, color: COLORS.text, marginBottom: 12 }}
            >
              You don’t have any recipes yet ☹️
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/recipes")}
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

      {/* Recipe Modal */}
      {selectedRecipe && (
        <Modal
          visible={!!selectedRecipe}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedRecipe(null)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 15,
                padding: 15,
                maxHeight: "80%",
              }}
            >
              <ScrollView>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    marginBottom: 10,
                    textAlign: "center",
                    color: COLORS.text,
                  }}
                >
                  {selectedRecipe.title}
                </Text>

                {selectedRecipe.image && (
                  <Image
                    source={{
                      uri: `http://192.168.14.27:8000/uploads/${selectedRecipe.image}`,
                    }}
                    style={{
                      width: "100%",
                      height: 180,
                      borderRadius: 10,
                      marginBottom: 15,
                    }}
                  />
                )}

                {selectedRecipe.description && (
                  <>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        color: COLORS.text,
                        marginTop: 10,
                      }}
                    >
                      Description:
                    </Text>
                    <Text
                      style={{ marginTop: 5, fontSize: 14, color: COLORS.text }}
                    >
                      {selectedRecipe.description}
                    </Text>
                  </>
                )}

                {selectedRecipe.ingredients?.length > 0 && (
                  <>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      Ingredients:
                    </Text>
                    <Text>
                      {selectedRecipe.ingredients
                        .map((i: { name: any }) => i.name)
                        .join(", ")}
                    </Text>
                  </>
                )}

                {selectedRecipe.categories?.length > 0 && (
                  <>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        color: COLORS.text,
                        marginTop: 10,
                      }}
                    >
                      Categories:
                    </Text>
                    <Text
                      style={{ marginTop: 5, fontSize: 14, color: COLORS.text }}
                    >
                      {selectedRecipe.categories
                        .map((c: any) => c.name)
                        .join(", ")}
                    </Text>
                  </>
                )}
              </ScrollView>

              {/* ✅ Delete Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: "red",
                  paddingVertical: 12,
                  borderRadius: 10,
                  marginTop: 10,
                  alignItems: "center",
                  opacity: deleting ? 0.6 : 1,
                }}
                onPress={() => {
                  if (!deleting) {
                    // ✅ Show confirmation alert before deletion
                    Alert.alert(
                      "Confirm Delete",
                      "Are you sure you want to delete this recipe?",
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => {
                            removeRecipe(selectedRecipe._id, {
                              onSuccess: () => setSelectedRecipe(null),
                            });
                          },
                        },
                      ]
                    );
                  }
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  {deleting ? "Deleting..." : "Delete Recipe"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.accent,
                  paddingVertical: 12,
                  borderRadius: 10,
                  marginTop: 15,
                  alignItems: "center",
                }}
                onPress={() => setSelectedRecipe(null)}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
