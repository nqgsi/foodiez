import { createRecipe } from "@/api/recipes";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

const CreateRecipeScreen = () => {
  // نفس الستيت حقّتك (مجرد تحكم بالحقل)
  const [name, setName] = useState("");
  const [category, setCategory] = useState(""); // مثال: "Dinner / Pasta"
  const [ingredients, setIngredients] = useState(""); // كل مكوّن في سطر
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createRecipe,

    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["recipes"] });
      router.back();
    },
    onError: (e: any) => {
      console.warn("Create failed:", e?.message);
    },
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    if (!res.canceled) {
      setImageUri(res.assets[0].uri);
    }
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

            {/* Recipe Name */}
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
              <TextInput
                value={category}
                onChangeText={setCategory}
                placeholder="e.g., Dinner / Pasta"
                placeholderTextColor="rgba(78,52,46,0.5)"
                style={styles.input}
              />
            </View>

            {/* Ingredients (multi-line) */}
            <View style={styles.field}>
              <Text style={styles.label}>Ingredients</Text>
              <TextInput
                value={ingredients}
                onChangeText={setIngredients}
                placeholder={"1) ...\n2) ...\n3) ..."}
                placeholderTextColor="rgba(78,52,46,0.5)"
                style={[styles.input, styles.multiline]}
                multiline
                textAlignVertical="top"
              />
              <View style={styles.badgesRow}>
                <View
                  style={[styles.badge, { backgroundColor: COLORS.highlight }]}
                >
                  <Text style={styles.badgeText}>Tip: one per line</Text>
                </View>
              </View>
            </View>

            {/* Description (multi-line) */}
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

            {/* Upload section */}
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
                  disabled={isPending || !name.trim()}
                >
                  <Text style={styles.buttonText}>
                    {isPending ? "Submitting..." : "Submit"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* optional helper / error example */}
              {/* <Text style={styles.errorText}>Please add a recipe name</Text> */}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 16,
  },
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
  field: {
    marginBottom: 14,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "600",
  },
  required: {
    color: COLORS.danger,
  },
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
  multiline: {
    minHeight: 110,
    lineHeight: 20,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
  },
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
  imageBoxText: {
    color: "rgba(78,52,46,0.7)",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadBtn: {
    backgroundColor: COLORS.accent, // Rust Orange
  },
  submitBtn: {
    backgroundColor: COLORS.primary, // Olive Green
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 15,
  },
  errorText: {
    marginTop: 8,
    color: COLORS.danger,
    fontSize: 13,
  },
});

export default CreateRecipeScreen;
