import { getRecipes } from "@/api/auth";
import {
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Colors = {
  background: "#DED7C6",
  primary: "#7A9E7E",
  accent: "#D35400",
  text: "#4E342E",
  highlight: "#F4D03F",
  danger: "#C0392B",
};

const categories: {
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}[] = [
  { name: "Breakfast", icon: "coffee" },
  { name: "Lunch", icon: "food-fork-drink" },
  { name: "Dinner", icon: "food" },
  { name: "Dessert", icon: "ice-cream" },
];

const mostLikedRecipe = {
  title: "Most Liked Recipe",
  image: "https://via.placeholder.com/300x150.png?text=Best+Recipe",
};

type Recipe = {
  _id: string;
  title: string;
  image?: string;
  time: string;
  difficulty: string;
  user: { _id: string; username: string; image?: string } | null;
  ingredients: string;
  categories: string;
};

const HomeScreen = () => {
  const {
    data: recipes,
    isLoading,
    isError,
  } = useQuery<Recipe[]>({
    queryKey: ["recipes"],

    queryFn: getRecipes,
  });

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
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

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <FontAwesome5 name="utensils" size={28} color={Colors.primary} />
        <View style={styles.headerRight}>
          <Feather
            name="search"
            size={24}
            color={Colors.text}
            style={{ marginRight: 15 }}
          />
          <AntDesign name="user" size={28} color={Colors.text} />
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Categories Grid */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((cat, index) => (
            <TouchableOpacity key={index} style={styles.categoryCard}>
              <MaterialCommunityIcons
                name={cat.icon}
                size={40}
                color="#FFF"
                style={{ marginBottom: 10 }}
              />
              <Text style={styles.categoryText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Recipes */}
        <Text style={styles.sectionTitle}>Featured Recipes</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.featuredScroll}
        >
          {recipes?.map((recipe) => (
            <View key={recipe._id} style={styles.featuredCard}>
              <Image
                source={{
                  uri: recipe.image
                    ? `http://192.168.14.27:8000/uploads/${recipe.image}`
                    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                }}
                style={styles.featuredImage}
              />
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <Text style={styles.recipeSubtitle}>
                {recipe.time} | {recipe.difficulty}
              </Text>

              {/* User info */}
              <View style={styles.userRow}>
                <Image
                  source={{
                    uri: recipe.user?.image
                      ? recipe.user.image
                      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                  }}
                  style={styles.userAvatar}
                />
                <Text style={styles.userName}>
                  {recipe.user?.username || "Unknown"}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Most Liked Recipe (Static for now) */}
        <Text style={styles.sectionTitle}>Most Liked</Text>
        <View style={styles.mostLikedCard}>
          <Image
            source={{ uri: mostLikedRecipe.image }}
            style={styles.mostLikedImage}
          />
          <Text style={styles.recipeTitle}>{mostLikedRecipe.title}</Text>
          <Text style={styles.recipeSubtitle}>45 min | Medium</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

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
  scroll: { paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
    marginVertical: 15,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    backgroundColor: Colors.primary,
    width: "48%",
    height: 120,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  featuredScroll: { marginBottom: 20 },
  featuredCard: {
    width: 250,
    backgroundColor: "#FFF",
    borderRadius: 15,
    marginRight: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  featuredImage: { width: "100%", height: 150 },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    margin: 10,
  },
  recipeSubtitle: {
    fontSize: 14,
    color: "#7A9E7E",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  mostLikedCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  mostLikedImage: { width: "100%", height: 180 },
  loaderContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  userAvatar: { width: 30, height: 30, borderRadius: 15, marginRight: 8 },
  userName: { fontSize: 14, color: Colors.text, fontWeight: "500" },
});
