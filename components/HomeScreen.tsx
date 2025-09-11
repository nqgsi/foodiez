import {
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Colors = {
  background: "#DED7C6", // Mushroom Taupe
  primary: "#7A9E7E", // Olive Green
  accent: "#D35400", // Rust Orange
  text: "#4E342E", // Dark Brown
  highlight: "#F4D03F", // Golden Beige
  danger: "#C0392B", // Deep Red
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

const featuredRecipes = [1, 2, 3, 4];

const mostLikedRecipe = {
  title: "Most Liked Recipe",
  image: "https://via.placeholder.com/300x150.png?text=Best+Recipe",
};

const HomeScreen = () => {
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
          {featuredRecipes.map((item) => (
            <View key={item} style={styles.featuredCard}>
              <Image
                source={{
                  uri: `https://via.placeholder.com/250x150.png?text=Recipe+${item}`,
                }}
                style={styles.featuredImage}
              />
              <Text style={styles.recipeTitle}>Recipe {item}</Text>
              <Text style={styles.recipeSubtitle}>30 min | Easy</Text>
            </View>
          ))}
        </ScrollView>

        {/* Most Likeable Recipe */}
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
  container: {
    flex: 1,
    backgroundColor: Colors.background, // Mushroom Taupe for full page
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.background, // Mushroom Taupe header
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  scroll: {
    paddingHorizontal: 20,
  },
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
  categoryText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  featuredScroll: {
    marginBottom: 20,
  },
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
  featuredImage: {
    width: "100%",
    height: 150,
  },
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
  mostLikedImage: {
    width: "100%",
    height: 180,
  },
});
