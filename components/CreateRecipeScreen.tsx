// src/app/(tabs)/creatRecipe.tsx  (or your path)
import {
  CategoryDTO,
  getCategories,
  getIngredients,
  IngredientDTO,
} from "@/api/categories";
import { createIngredient } from "@/api/ingrediants";
import { createRecipe } from "@/api/recipes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const COLORS = {
  bg: "#DED7C6",
  primary: "#7A9E7E",
  accent: "#D35400",
  text: "#4E342E",
  highlight: "#F4D03F",
  danger: "#C0392B",
  white: "#FFFFFF",
  faint: "rgba(78, 52, 46, 0.08)",
};

export default function CreateRecipeScreen() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryDTO | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<
    IngredientDTO[]
  >([]);
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [openCat, setOpenCat] = useState(false);
  const [openIng, setOpenIng] = useState(false);

  // NEW: small modal to create an ingredient
  const [openCreateIng, setOpenCreateIng] = useState(false);
  const [newIngName, setNewIngName] = useState("");

  const [searchCat, setSearchCat] = useState("");
  const [searchIng, setSearchIng] = useState("");

  const qc = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const { data: ingredients = [] } = useQuery({
    queryKey: ["ingredients"],
    queryFn: getIngredients,
  });

  const filteredCats = useMemo(
    () =>
      categories.filter((c) =>
        c.name.toLowerCase().includes(searchCat.trim().toLowerCase())
      ),
    [categories, searchCat]
  );
  const filteredIngs = useMemo(
    () =>
      ingredients.filter((i) =>
        i.name.toLowerCase().includes(searchIng.trim().toLowerCase())
      ),
    [ingredients, searchIng]
  );

  // ----- Create Recipe -----
  const { mutate, isPending } = useMutation({
    mutationFn: createRecipe,
    onMutate: async (vars: {
      title: string;
      description?: string;
      categoryIds?: string[];
      ingredientIds?: string[];
      imageUri?: string | null;
    }) => {
      await qc.cancelQueries({ queryKey: ["recipes"] });
      const previous = qc.getQueryData<any[]>(["recipes"]) || [];

      const optimistic: any = {
        _id: `tmp-${Date.now()}`,
        title: vars.title,
        description: vars.description,
        image: undefined,
        ingredients: [],
        categories: [],
        __optimistic: true,
      };
      qc.setQueryData<any[]>(["recipes"], (old) => [
        optimistic,
        ...(old ?? []),
      ]);
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(["recipes"], ctx.previous);
    },
    onSuccess: (created) => {
      qc.setQueryData<any[]>(["recipes"], (old) => {
        const list = old ?? [];
        const withoutTmp = list.filter((r) => !r.__optimistic);
        return [created, ...withoutTmp];
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["recipes"], exact: true });
      router.back();
    },
  });

  // ----- Create Ingredient (tiny modal action) -----
  const { mutate: addIngredient, isPending: creatingIng } = useMutation({
    mutationFn: (name: string) => createIngredient(name),
    onSuccess: (created) => {
      // refresh server list
      qc.invalidateQueries({ queryKey: ["ingredients"] });
      // optionally auto-select newly created one
      setSelectedIngredients((prev) =>
        prev.find((x) => x._id === created._id)
          ? prev
          : [...prev, created as any]
      );
      setNewIngName("");
      setOpenCreateIng(false);
    },
    onError: (e: any) => {
      console.warn(
        "Create ingredient failed:",
        e?.response?.data || e?.message
      );
    },
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    if (!res.canceled) setImageUri(res.assets[0].uri);
  };

  const toggleIngredient = (ing: IngredientDTO) => {
    setSelectedIngredients((prev) => {
      const exists = prev.find((x) => x._id === ing._id);
      return exists ? prev.filter((x) => x._id !== ing._id) : [...prev, ing];
    });
  };

  const onSubmit = () => {
    if (!name.trim()) return;
    mutate({
      title: name,
      description,
      categoryIds: category ? [category._id] : [],
      ingredientIds: selectedIngredients.map((i) => i._id),
      imageUri,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.title}>Create Recipe</Text>

            {/* Name */}
            <View style={styles.field}>
              <Text style={styles.label}>
                Recipe Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g., Creamy Mushroom Pasta"
                placeholderTextColor="rgba(78,52,46,0.5)"
                style={styles.input}
              />
            </View>

            {/* Category */}
            <View style={styles.field}>
              <Text style={styles.label}>Category</Text>
              <Pressable style={styles.input} onPress={() => setOpenCat(true)}>
                <Text
                  style={{
                    color: category ? COLORS.text : "rgba(78,52,46,0.5)",
                  }}
                >
                  {category ? category.name : "Select a category"}
                </Text>
              </Pressable>
            </View>

            {/* Ingredients */}
            <View style={styles.field}>
              <Text style={styles.label}>Ingredients</Text>
              <Pressable style={styles.input} onPress={() => setOpenIng(true)}>
                <Text
                  style={{
                    color: selectedIngredients.length
                      ? COLORS.text
                      : "rgba(78,52,46,0.5)",
                  }}
                >
                  {selectedIngredients.length
                    ? `${selectedIngredients.length} selected`
                    : "Select ingredients"}
                </Text>
              </Pressable>

              {selectedIngredients.length > 0 && (
                <View style={[styles.badgesRow, { flexWrap: "wrap" }]}>
                  {selectedIngredients.map((i) => (
                    <View
                      key={i._id}
                      style={[
                        styles.badge,
                        { backgroundColor: COLORS.highlight, marginTop: 6 },
                      ]}
                    >
                      <Text style={styles.badgeText}>{i.name}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* ⬇️ Small button to create ingredient */}
              <View style={{ marginTop: 8, alignItems: "flex-start" }}>
                <TouchableOpacity
                  onPress={() => setOpenCreateIng(true)}
                  activeOpacity={0.85}
                  style={styles.smallAddBtn}
                >
                  <Text style={styles.smallAddBtnPlus}>＋</Text>
                  <Text style={styles.smallAddBtnText}>Create Ingredient</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            <View style={styles.field}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Short steps or notes..."
                placeholderTextColor="rgba(78,52,46,0.5)"
                style={[styles.input, styles.multiline]}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Upload */}
            <View style={[styles.field, { marginTop: 8 }]}>
              <Text style={styles.label}>Upload Recipe Image</Text>
              <View style={styles.imageBox}>
                <Text style={styles.imageBoxText}>
                  {imageUri ? imageUri.split("/").pop() : "No image selected"}
                </Text>
              </View>

              <View style={styles.row}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.button, styles.uploadBtn]}
                  onPress={pickImage}
                >
                  <Text style={styles.buttonText}>Upload Image</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.button, styles.submitBtn]}
                  onPress={onSubmit}
                  disabled={isPending || !name.trim()}
                >
                  <Text style={styles.buttonText}>
                    {isPending ? "Submitting..." : "Submit"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Category Modal (picker) */}
      <Modal
        visible={openCat}
        animationType="slide"
        transparent
        onRequestClose={() => setOpenCat(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <TextInput
              value={searchCat}
              onChangeText={setSearchCat}
              placeholder="Search..."
              placeholderTextColor="rgba(78,52,46,0.5)"
              style={[styles.input, { marginBottom: 10 }]}
            />
            <FlatList
              data={filteredCats}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[
                    styles.modalItem,
                    category?._id === item._id && {
                      backgroundColor: COLORS.faint,
                      borderColor: COLORS.primary,
                    },
                  ]}
                  onPress={() => setCategory(item)}
                >
                  <Text style={{ color: COLORS.text }}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={{ padding: 16 }}>
                  <Text style={{ color: COLORS.text }}>No categories</Text>
                </View>
              }
            />
            <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
              <TouchableOpacity
                style={[styles.button, styles.uploadBtn]}
                onPress={() => setOpenCat(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitBtn]}
                onPress={() => setOpenCat(false)}
              >
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Ingredients Modal (picker) */}
      <Modal
        visible={openIng}
        animationType="slide"
        transparent
        onRequestClose={() => setOpenIng(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select Ingredients</Text>
            <TextInput
              value={searchIng}
              onChangeText={setSearchIng}
              placeholder="Search..."
              placeholderTextColor="rgba(78,52,46,0.5)"
              style={[styles.input, { marginBottom: 10 }]}
            />
            <FlatList
              data={filteredIngs}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => {
                const picked = !!selectedIngredients.find(
                  (x) => x._id === item._id
                );
                return (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                      styles.modalItem,
                      picked && {
                        backgroundColor: COLORS.faint,
                        borderColor: COLORS.primary,
                      },
                    ]}
                    onPress={() => toggleIngredient(item)}
                  >
                    <Text style={{ color: COLORS.text }}>
                      {picked ? "✓ " : ""}
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={{ padding: 16 }}>
                  <Text style={{ color: COLORS.text }}>No ingredients</Text>
                </View>
              }
            />
            <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
              <TouchableOpacity
                style={[styles.button, styles.uploadBtn]}
                onPress={() => setOpenIng(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitBtn]}
                onPress={() => setOpenIng(false)}
              >
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Tiny Create Ingredient Modal */}
      <Modal
        visible={openCreateIng}
        animationType="fade"
        transparent
        onRequestClose={() => setOpenCreateIng(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.select({ ios: "padding", android: undefined })}
        >
          <View style={styles.centerOverlay}>
            <View style={styles.smallModal}>
              <Text style={styles.modalTitle}>Create Ingredient</Text>
              <TextInput
                value={newIngName}
                onChangeText={setNewIngName}
                placeholder="e.g., Tomato"
                placeholderTextColor="#7a6b60"
                style={styles.modalInput}
                returnKeyType="done"
                onSubmitEditing={() => {
                  if (!creatingIng && newIngName.trim())
                    addIngredient(newIngName.trim());
                }}
              />

              <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
                <TouchableOpacity
                  style={[styles.button, styles.uploadBtn]}
                  onPress={() => {
                    setNewIngName("");
                    setOpenCreateIng(false);
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        !newIngName.trim() || creatingIng
                          ? "#a8b7ab"
                          : COLORS.primary,
                    },
                  ]}
                  disabled={!newIngName.trim() || creatingIng}
                  onPress={() => addIngredient(newIngName.trim())}
                >
                  <Text style={styles.buttonText}>
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
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  field: { marginBottom: 14 },
  label: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "600",
  },
  required: { color: COLORS.danger },
  input: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.faint,
    color: COLORS.text,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
  },
  multiline: { minHeight: 110, lineHeight: 20 },
  badgesRow: { flexDirection: "row", gap: 8, marginTop: 6 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { color: COLORS.text, fontSize: 12, fontWeight: "700" },
  imageBox: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.faint,
    borderRadius: 10,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  imageBoxText: { color: "rgba(78,52,46,0.7)" },
  row: { flexDirection: "row", gap: 10 },
  button: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadBtn: { backgroundColor: COLORS.accent },
  submitBtn: { backgroundColor: COLORS.primary },
  buttonText: { color: COLORS.white, fontWeight: "700", fontSize: 15 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "75%",
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(78,52,46,0.12)",
    marginBottom: 8,
  },

  // Small inline "Create Ingredient" button
  smallAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#EDE7DA",
    borderWidth: 1,
    borderColor: "rgba(78,52,46,0.18)",
  },
  smallAddBtnPlus: {
    color: COLORS.text,
    fontSize: 14,
    marginRight: 6,
    fontWeight: "800",
  },
  smallAddBtnText: { color: COLORS.text, fontSize: 13, fontWeight: "700" },

  // Centered tiny modal
  centerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  smallModal: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "rgba(78,52,46,0.18)",
    backgroundColor: "#EFE9DA",
    color: COLORS.text,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 10 }),
  },
});
