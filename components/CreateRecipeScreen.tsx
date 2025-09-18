// src/app/(tabs)/creatRecipe.tsx
import {
  CategoryDTO,
  createCategory,
  getCategories,
  getIngredients,
  IngredientDTO,
} from "@/api/categories";
import { createIngredient } from "@/api/ingrediants";
import { fetchProfile } from "@/api/profile";
import { createRecipe, RecipeDTO } from "@/api/recipes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
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
  const queryClient = useQueryClient();

  // --- State ---
  const [name, setName] = useState("");
  const [categoriesSelected, setCategoriesSelected] = useState<CategoryDTO[]>(
    []
  );
  const [selectedIngredients, setSelectedIngredients] = useState<
    IngredientDTO[]
  >([]);
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [openCat, setOpenCat] = useState(false);
  const [openIng, setOpenIng] = useState(false);
  const [openCreateIng, setOpenCreateIng] = useState(false);
  const [openCreateCat, setOpenCreateCat] = useState(false);

  const [newIngName, setNewIngName] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [searchCat, setSearchCat] = useState("");
  const [searchIng, setSearchIng] = useState("");

  // --- Error State ---
  const [errors, setErrors] = useState({
    name: "",
    categories: "",
    ingredients: "",
    image: "",
  });

  // --- Fetch ---
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: ingredients = [] } = useQuery({
    queryKey: ["ingredients"],
    queryFn: getIngredients,
  });

  const { data: currentUser } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
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

  // --- Mutations ---
  const { mutate, isPending } = useMutation({
    mutationFn: createRecipe,
    onMutate: async (vars: {
      title: string;
      description?: string;
      categoryIds?: string[];
      ingredientIds?: string[];
      imageUri?: string | null;
    }) => {
      await queryClient.cancelQueries({ queryKey: ["recipes"] });
      const previous = queryClient.getQueryData<RecipeDTO[]>(["recipes"]) || [];

      const optimistic: RecipeDTO = {
        _id: `tmp-${Date.now()}`,
        title: vars.title,
        description: vars.description || "",
        image: vars.imageUri ?? undefined,
        ingredients: [],
        categories: [],
        __optimistic: true,
        user: currentUser,
      };

      queryClient.setQueryData<RecipeDTO[]>(["recipes"], (old = []) => [
        optimistic,
        ...old,
      ]);

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        queryClient.setQueryData(["recipes"], context.previous);
      if (_err) {
        Alert.alert("You need an account", "Please log in to create a recipe.");
      } else {
        Alert.alert("Error", "Something went wrong.");
      }
    },
    onSuccess: (created) => {
      queryClient.setQueryData<RecipeDTO[]>(["recipes"], (old = []) => {
        const withoutTmp = old.filter((r) => !r.__optimistic);
        return [created, ...withoutTmp];
      });
      router.back();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"], exact: true });
    },
  });

  // --- Ingredient ---
  const { mutate: addIngredient, isPending: creatingIng } = useMutation({
    mutationFn: (name: string) => createIngredient(name),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      setSelectedIngredients((prev) =>
        prev.find((x) => x._id === created._id)
          ? prev
          : [...prev, created as any]
      );
      setNewIngName("");
      setOpenCreateIng(false);
    },
  });

  // --- Category ---
  const { mutate: addCategory, isPending: creatingCat } = useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setCategoriesSelected((prev) =>
        prev.find((x) => x._id === created._id) ? prev : [...prev, created]
      );
      setNewCatName("");
      setOpenCreateCat(false);
    },
  });

  // --- Image Picker ---
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
    setSelectedIngredients((prev) =>
      prev.find((x) => x._id === ing._id)
        ? prev.filter((x) => x._id !== ing._id)
        : [...prev, ing]
    );
  };

  const toggleCategory = (cat: CategoryDTO) => {
    setCategoriesSelected((prev) =>
      prev.find((x) => x._id === cat._id)
        ? prev.filter((x) => x._id !== cat._id)
        : [...prev, cat]
    );
  };

  // --- Submit with Validation ---
  const onSubmit = () => {
    const newErrors = {
      name: !name.trim() ? "Recipe name is required." : "",
      categories:
        categoriesSelected.length === 0 ? "Select at least one category." : "",
      ingredients:
        selectedIngredients.length === 0
          ? "Select at least one ingredient."
          : "",
      image: !imageUri ? "Recipe image is required." : "",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    mutate({
      title: name,
      description,
      categoryIds: categoriesSelected.map((c) => c._id),
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
              {errors.name ? (
                <Text style={styles.errorText}>{errors.name}</Text>
              ) : null}
            </View>

            {/* Categories */}
            <View style={styles.field}>
              <Text style={styles.label}>
                Categories <Text style={styles.required}>*</Text>
              </Text>
              <Pressable style={styles.input} onPress={() => setOpenCat(true)}>
                <Text
                  style={{
                    color: categoriesSelected.length
                      ? COLORS.text
                      : "rgba(78,52,46,0.5)",
                  }}
                >
                  {categoriesSelected.length
                    ? `${categoriesSelected.length} selected`
                    : "Select categories"}
                </Text>
              </Pressable>
              {categoriesSelected.length > 0 && (
                <View style={[styles.badgesRow, { flexWrap: "wrap" }]}>
                  {categoriesSelected.map((i) => (
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
              {errors.categories ? (
                <Text style={styles.errorText}>{errors.categories}</Text>
              ) : null}
              <View style={{ marginTop: 8, alignItems: "flex-start" }}>
                <TouchableOpacity
                  onPress={() => setOpenCreateCat(true)}
                  activeOpacity={0.85}
                  style={styles.smallAddBtn}
                >
                  <Text style={styles.smallAddBtnPlus}>＋</Text>
                  <Text style={styles.smallAddBtnText}>Create Category</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Ingredients */}
            <View style={styles.field}>
              <Text style={styles.label}>
                Ingredients <Text style={styles.required}>*</Text>
              </Text>
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
              {errors.ingredients ? (
                <Text style={styles.errorText}>{errors.ingredients}</Text>
              ) : null}
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
              <Text style={styles.label}>
                Upload Recipe Image <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.imageBox}>
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={{ width: "100%", height: "100%", borderRadius: 10 }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.imageBoxText}>No image selected</Text>
                )}
              </View>
              {errors.image ? (
                <Text style={styles.errorText}>{errors.image}</Text>
              ) : null}

              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.button, styles.uploadBtn]}
                  onPress={pickImage}
                >
                  <Text style={styles.buttonText}>Upload Image</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.submitBtn,
                    (!name.trim() ||
                      !categoriesSelected.length ||
                      !selectedIngredients.length ||
                      !imageUri) && { backgroundColor: "#a8b7ab" },
                  ]}
                  onPress={onSubmit}
                  disabled={
                    isPending ||
                    !name.trim() ||
                    !categoriesSelected.length ||
                    !selectedIngredients.length ||
                    !imageUri
                  }
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

      {/* ----- Modals for Categories & Ingredients ----- */}
      {/* Category Modal */}
      <Modal
        visible={openCat}
        animationType="slide"
        transparent
        onRequestClose={() => setOpenCat(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select Categories</Text>
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
              renderItem={({ item }) => {
                const picked = !!categoriesSelected.find(
                  (x) => x._id === item._id
                );
                return (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      picked && {
                        backgroundColor: COLORS.faint,
                        borderColor: COLORS.primary,
                      },
                    ]}
                    onPress={() => toggleCategory(item)}
                  >
                    <Text style={{ color: COLORS.text }}>
                      {picked ? "✓ " : ""}
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
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

      {/* Ingredient Modal */}
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

      {/* Tiny Create Category Modal */}
      <Modal
        visible={openCreateCat}
        animationType="fade"
        transparent
        onRequestClose={() => setOpenCreateCat(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.select({ ios: "padding", android: undefined })}
        >
          <View style={styles.centerOverlay}>
            <View style={styles.smallModal}>
              <Text style={styles.modalTitle}>Create Category</Text>
              <TextInput
                value={newCatName}
                onChangeText={setNewCatName}
                placeholder="e.g., Desserts"
                placeholderTextColor="#7a6b60"
                style={styles.modalInput}
                returnKeyType="done"
                onSubmitEditing={() => {
                  if (!creatingCat && newCatName.trim())
                    addCategory(newCatName.trim());
                }}
              />
              <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
                <TouchableOpacity
                  style={[styles.button, styles.uploadBtn]}
                  onPress={() => setOpenCreateCat(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        !newCatName.trim() || creatingCat
                          ? "#a8b7ab"
                          : COLORS.primary,
                    },
                  ]}
                  disabled={!newCatName.trim() || creatingCat}
                  onPress={() => addCategory(newCatName.trim())}
                >
                  <Text style={styles.buttonText}>
                    {creatingCat ? "Saving..." : "Save"}
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

// --- Styles (unchanged) ---
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
  errorText: { color: COLORS.danger, fontSize: 12, marginTop: 4 },
});
