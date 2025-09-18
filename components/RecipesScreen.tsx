// app/(tabs)/recipes.tsx
import { createIngredient } from "@/api/ingrediants";
import { getRecipes, RecipeDTO } from "@/api/recipes";
import RecipeCard from "@/components/RecipeCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

// 🔧 change to your LAN/IP if needed
const SERVER_UPLOADS = "http://172.20.10.5:8000/uploads/";

function buildImageUrl(img?: string | null) {
  if (!img) return undefined;
  return img.startsWith("http") ? img : `${SERVER_UPLOADS}${img}`;
}

export default function RecipesScreen() {
  const [q, setQ] = useState("");

  // create-ingredient modal state
  const [openIng, setOpenIng] = useState(false);
  const [ingName, setIngName] = useState("");

  // recipe details modal state
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDTO | null>(null);

  const qc = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch recipes
  const { data, isLoading, isError, refetch } = useQuery<RecipeDTO[]>({
    queryKey: ["recipes"],
    queryFn: getRecipes,
  });

  // Create ingredient mutation
  const { mutate: addIngredient, isPending: creatingIng } = useMutation({
    mutationFn: (name: string) => createIngredient(name),
    onSuccess: () => {
      setIngName("");
      setOpenIng(false);
      qc.invalidateQueries({ queryKey: ["ingredients"] });
    },
  });

  // Pull-to-refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Filtered recipes
  const filtered = useMemo(
    () =>
      (data ?? []).filter((r) =>
        r.title.toLowerCase().includes(q.trim().toLowerCase())
      ),
    [data, q]
  );

  // Show spinner while loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Recipes</Text>
        <View style={{ width: 36, height: 36 }} />
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search recipes"
          placeholderTextColor="#7a6b60"
          value={q}
          onChangeText={setQ}
          style={styles.searchInput}
        />
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
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
          onPress={() => setOpenIng(true)}
        >
          <Text style={styles.actionPlus}>＋</Text>
          <Text style={styles.actionLabel}>Create Ingredients</Text>
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>All Recipes</Text>
      </View>

      {/* Grid */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={{ alignItems: "center", padding: 24 }}>
            <Text style={{ color: COLORS.text }}>
              {isError ? "Failed to load" : "No recipes"}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <RecipeCard
            title={item.title}
            image={buildImageUrl(item.image) || undefined} // fix TypeScript
            onPress={() => setSelectedRecipe(item)}
          />
        )}
      />

      {/* ===== Recipe Details Modal ===== */}
      <Modal
        visible={!!selectedRecipe}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedRecipe(null)}
      >
        <View style={styles.centerOverlay}>
          <View style={styles.recipeCardModal}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.recipeModalTitle}>
                {selectedRecipe?.title}
              </Text>

              <Image
                source={{
                  uri:
                    buildImageUrl(selectedRecipe?.image) ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                }}
                style={styles.recipeModalImage}
              />

              {selectedRecipe?.description && (
                <>
                  <Text style={styles.recipeModalSection}>Description</Text>
                  <Text style={styles.recipeModalText}>
                    {selectedRecipe.description}
                  </Text>
                </>
              )}

              <Text style={styles.recipeModalSection}>Ingredients</Text>
              <Text style={styles.recipeModalText}>
                {(selectedRecipe?.ingredients ?? [])
                  .map((i) => i.name)
                  .join(", ")}
              </Text>

              <Text style={styles.recipeModalSection}>Categories</Text>
              <Text style={styles.recipeModalText}>
                {(selectedRecipe?.categories ?? [])
                  .map((c) => c.name)
                  .join(", ")}
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelectedRecipe(null)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ===== Create Ingredient Bottom Sheet ===== */}
      <Modal
        visible={openIng}
        animationType="slide"
        transparent
        statusBarTranslucent
        onRequestClose={() => setOpenIng(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.select({ ios: "padding", android: undefined })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>Create Ingredient</Text>

              <TextInput
                value={ingName}
                onChangeText={setIngName}
                placeholder="e.g., Tomato"
                placeholderTextColor="#7a6b60"
                style={styles.modalInput}
                returnKeyType="done"
                onSubmitEditing={() =>
                  !creatingIng &&
                  ingName.trim() &&
                  addIngredient(ingName.trim())
                }
              />

              <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: COLORS.accent }]}
                  onPress={() => {
                    setIngName("");
                    setOpenIng(false);
                  }}
                >
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalBtn,
                    {
                      backgroundColor:
                        !ingName.trim() || creatingIng
                          ? "#a8b7ab"
                          : COLORS.primary,
                    },
                  ]}
                  disabled={!ingName.trim() || creatingIng}
                  onPress={() => addIngredient(ingName.trim())}
                >
                  <Text style={styles.modalBtnText}>
                    {creatingIng ? "Saving..." : "Save"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(78,52,46,0.18)",
  },
  backIcon: { color: COLORS.text, fontSize: 16, fontWeight: "700" },
  headerTitle: { color: COLORS.text, fontSize: 22, fontWeight: "800" },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 10 }),
    borderWidth: 1,
    borderColor: "rgba(78,52,46,0.18)",
    color: COLORS.text,
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 14,
  },
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

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: "800" },

  // recipe details modal (centered card)
  centerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  recipeCardModal: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    maxHeight: "85%",
  },
  recipeModalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 10,
  },
  recipeModalImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },
  recipeModalSection: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 10,
  },
  recipeModalText: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 4,
  },
  closeBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 14,
    alignItems: "center",
  },

  // bottom sheet (create ingredient)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: { color: COLORS.text, fontSize: 18, fontWeight: "800" },
  modalInput: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(78,52,46,0.18)",
    backgroundColor: COLORS.card,
    color: COLORS.text,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 10 }),
  },
  modalBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnText: { color: COLORS.white, fontWeight: "800" },
});
