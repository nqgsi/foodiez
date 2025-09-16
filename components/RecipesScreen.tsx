import { getRecipes } from "@/api/auth";
import { RecipeDTO } from "@/api/recipes";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecipeCard from "./RecipeCard";
const COLORS = {
  background: "#DED7C6",
  primary: "#7A9E7E",
  accent: "#D35400",
  text: "#4E342E",
  white: "#FFFFFF",
  card: "#EFE9DA",
  badge: "#F4D03F",
  shadow: "rgba(0,0,0,0.10)",
};

export default function RecipesScreen() {
  const [q, setQ] = useState("");
  const { data, isLoading, isError } = useQuery<RecipeDTO[]>({
    queryKey: ["recipes"],
    queryFn: getRecipes,
  });

  const filtered = useMemo(() => {
    const list = data ?? [];
    return list.filter((r) =>
      r.title.toLowerCase().includes(q.trim().toLowerCase())
    );
  }, [data, q]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* ... هيدر + بحث + الأزرار ... نفس كودك */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 12,
          paddingHorizontal: 16,
          marginTop: 14,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.actionCard, { backgroundColor: COLORS.primary }]}
          onPress={() => router.push("/creatRecipe")}
        >
          <Text style={styles.actionPlus}>＋</Text>
          <Text style={styles.actionLabel}>Create Recipe</Text>
        </TouchableOpacity>

        <Pressable
          style={[styles.actionCard, { backgroundColor: COLORS.accent }]}
        >
          <Text style={styles.actionPlus}>＋</Text>
          <Text style={styles.actionLabel}>Create Ingredients</Text>
        </Pressable>
      </View>

      {/* قائمة الوصفات */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 20,
          paddingTop: 16,
        }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", padding: 24 }}>
            <Text style={{ color: COLORS.text }}>
              {isLoading
                ? "Loading..."
                : isError
                ? "Failed to load"
                : "No recipes"}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <RecipeCard
            title={item.title}
            image={item.image}
            onPress={() => console.log("open recipe", item._id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actionCard: {
    flex: 1,
    height: 94,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  actionPlus: { fontSize: 24, color: COLORS.white, marginBottom: 4 },
  actionLabel: { color: COLORS.white, fontWeight: "800" },
});
