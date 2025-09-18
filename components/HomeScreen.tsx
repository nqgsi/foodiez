import { getRecipes, getUsers } from "@/api/auth";
import { AntDesign, Feather, FontAwesome5 } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import debounce from "lodash.debounce";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------- Types ----------
type User = {
  _id: string;
  username: string;
  image?: string;
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

// ---------- Colors ----------
const Colors = {
  background: "#DED7C6",
  primary: "#7A9E7E",
  accent: "#D35400",
  text: "#4E342E",
  highlight: "#F4D03F",
  danger: "#C0392B",
};

const HomeScreen = () => {
  const { categoryId, categoryName } = useLocalSearchParams();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const queryClient = useQueryClient();

  // Fetch both users and recipes
  const { data, isLoading, isError } = useQuery<UsersAndRecipes>({
    queryKey: ["users-and-recipes"],
    queryFn: async () => {
      const [users, recipes] = await Promise.all([getUsers(), getRecipes()]);
      return { users, recipes };
    },
  });

  // Always make recipes an array
  const recipes: Recipe[] = data?.recipes ?? [];

  const filteredRecipes = recipes
    .filter((recipe) =>
      recipe.title.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((recipe) =>
      categoryId
        ? recipe.categories.some((cat) => cat._id === categoryId)
        : true
    );

  // Debounced refresh
  const handleRefresh = useCallback(
    debounce(async () => {
      setRefreshing(true);
      await queryClient.invalidateQueries({ queryKey: ["users-and-recipes"] });
      setRefreshing(false);
    }, 500),
    []
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={{ color: Colors.danger, fontSize: 18 }}>
          Failed to load recipes 😔
        </Text>
      </View>
    );
  }

  // FlatList render item
  const renderRecipe = ({ item: recipe }: { item: Recipe }) => (
    <TouchableOpacity
      key={recipe._id}
      style={styles.featuredCard}
      onPress={() => setSelectedRecipe(recipe)}
    >
      <Image
        source={{
          uri: recipe.image
            ? `http://192.168.14.27:8000/uploads/${recipe.image}`
            : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        }}
        style={styles.featuredImage}
      />
      <Text style={styles.recipeTitle}>{recipe.title}</Text>
      <View style={styles.userRow}>
        {recipe.user?.image ? (
          <Image
            source={{
              uri: `http://192.168.14.27:8000/uploads/${recipe.user.image}`,
            }}
            style={styles.userAvatar}
          />
        ) : (
          <Text style={{ fontSize: 20, marginRight: 8 }}>👤</Text>
        )}
        <Text style={styles.userName}>
          {recipe.user?.username || "Unknown"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <FontAwesome5 name="utensils" size={28} color={Colors.primary} />
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => setSearchVisible(!searchVisible)}
          >
            <Feather name="search" size={26} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <AntDesign name="user" size={28} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {categoryId && (
        <TouchableOpacity
          style={styles.clearFilterBtn}
          onPress={() => router.replace("/(tabs)/home")}
          activeOpacity={0.8}
        >
          <Text style={styles.clearFilterText}>View all recipes ✨</Text>
        </TouchableOpacity>
      )}

      {searchVisible && (
        <TextInput
          placeholder="Search recipes..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      )}

      <Text style={styles.sectionTitle}>
        {categoryId ? ` ${categoryName} Recipes` : "View Recipes 🍽️"}
      </Text>

      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item._id}
        renderItem={renderRecipe}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <Text
            style={{
              color: Colors.text,
              fontSize: 16,
              marginTop: 20,
              textAlign: "center",
            }}
          >
            No recipes found 🔍
          </Text>
        }
      />

      {/* Modal */}
      {selectedRecipe && (
        <Modal
          visible={!!selectedRecipe}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedRecipe(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalTitle}>{selectedRecipe?.title}</Text>
                <Image
                  source={{
                    uri: selectedRecipe?.image
                      ? `http://192.168.14.27:8000/uploads/${selectedRecipe.image}`
                      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                  }}
                  style={styles.modalImage}
                />

                {/* Description */}
                {selectedRecipe?.description && (
                  <>
                    <Text style={styles.modalSection}>Description:</Text>
                    <Text style={styles.modalText}>
                      {selectedRecipe.description}
                    </Text>
                  </>
                )}

                {/* Ingredients */}
                <Text style={styles.modalSection}>Ingredients:</Text>
                <Text style={styles.modalText}>
                  {selectedRecipe?.ingredients
                    .map((ing) => ing.name)
                    .join(", ")}
                </Text>

                {/* Categories */}
                <Text style={styles.modalSection}>Categories:</Text>
                <Text style={styles.modalText}>
                  {selectedRecipe?.categories.map((cat) => cat.name).join(", ")}
                </Text>
              </ScrollView>

              <TouchableOpacity
                style={styles.closeButton}
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

export default HomeScreen;

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.background,
  },
  headerRight: { flexDirection: "row", alignItems: "center" },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 20,
  },
  featuredCard: {
    width: "92%",
    backgroundColor: "#FFF",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    paddingBottom: 10,
    alignSelf: "center",
  },
  featuredImage: { width: "100%", height: 180 },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  userRow: { flexDirection: "row", alignItems: "center", marginHorizontal: 10 },
  userAvatar: { width: 30, height: 30, borderRadius: 15, marginRight: 8 },
  userName: { fontSize: 14, color: Colors.text, fontWeight: "500" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: Colors.text,
  },
  modalImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalSection: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: Colors.text,
  },
  modalText: { fontSize: 14, marginTop: 5, color: Colors.text },
  closeButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  clearFilterBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: -1,
    marginLeft: 22,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  clearFilterText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 18,
    textTransform: "none",
    letterSpacing: 0.3,
  },
});
