import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Category, createCategory, getCategories } from "../api/categories";
const COLORS = {
  background: "#DED7C6",
  primary: "#7A9E7E",
  accent: "#D35400",
  text: "#4E342E",
  white: "#FFFFFF",
  card: "#EFE9DA",
  shadow: "rgba(0,0,0,0.10)",
};

const SERVER_URL = "http://172.20.10.5:8000/uploads/";

const CategoriesScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [image, setImage] = useState<any>(null);

  // Helper function to build image URLs
  const buildImageUrl = (img?: string) => {
    if (!img) return null;
    return img.startsWith("http") ? img : `${SERVER_URL}${img}`;
  };

  async function load() {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function pickImage() {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      return Alert.alert("Permission required", "Please allow gallery access.");
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!res.canceled) {
      setImage(res.assets[0]);
    }
  }

  async function onCreate() {
    if (!newName.trim()) {
      return Alert.alert("Error", "Enter category name");
    }
    if (!image) {
      return Alert.alert("Error", "Upload an image for the category");
    }
    try {
      setCreating(true);
      await createCategory(newName.trim(), image);
      setNewName("");
      setImage(null);
      await load();
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || e?.message || "Failed to create category";
      Alert.alert("Error", msg);
    } finally {
      setCreating(false);
    }
  }

  const cats = Array.isArray(categories) ? categories : [];
  const popular = cats.slice(0, 4);
  const rest = cats.slice(4);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
        backgroundColor={COLORS.background}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.8}>
            <Text style={styles.backIcon}>🍕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Categories</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.createWrap}>
          <TextInput
            placeholder="New category name"
            placeholderTextColor="#7a6b60"
            style={styles.createInput}
            value={newName}
            onChangeText={setNewName}
          />
          <TouchableOpacity
            style={[styles.createBtn, { backgroundColor: COLORS.accent }]}
            activeOpacity={0.8}
            onPress={pickImage}
          >
            <Text style={styles.createBtnText}>Upload Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.createBtn}
            activeOpacity={0.8}
            onPress={onCreate}
            disabled={creating}
          >
            {creating ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.createBtnText}>Add</Text>
            )}
          </TouchableOpacity>
        </View>

        {image && (
          <View style={{ marginBottom: 12 }}>
            <Image
              source={{ uri: image.uri }}
              style={{ width: "100%", height: 150, borderRadius: 12 }}
            />
          </View>
        )}

        {loading ? (
          <View style={{ marginTop: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Popular Categories</Text>
              <View style={styles.grid}>
                {popular.length === 0 ? (
                  <Text style={{ color: "#6B4F45" }}>No categories yet.</Text>
                ) : (
                  popular.map((c) => (
                    <TouchableOpacity
                      key={c._id}
                      style={styles.gridCard}
                      activeOpacity={0.8}
                      onPress={() =>
                        router.push({
                          pathname: "/(tabs)/home",
                          params: { categoryId: c._id, categoryName: c.name },
                        })
                      }
                    >
                      {c.image ? (
                        <Image
                          source={{ uri: buildImageUrl(c.image) || undefined }}
                          style={styles.gridImage}
                        />
                      ) : (
                        <View style={styles.gridImage} />
                      )}
                      <Text style={styles.gridTitle}>{c.name}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeading}>All Categories</Text>
              {(rest.length ? rest : cats).map((c) => (
                <TouchableOpacity
                  key={c._id}
                  style={styles.listItem}
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/home",
                      params: { categoryId: c._id, categoryName: c.name },
                    })
                  }
                >
                  {c.image ? (
                    <Image
                      source={{ uri: buildImageUrl(c.image) || undefined }}
                      style={styles.listPic}
                    />
                  ) : (
                    <View style={styles.listPic} />
                  )}
                  <Text style={styles.listTitle}>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoriesScreen;

// Styles remain unchanged
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: 20, paddingBottom: 30 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    marginBottom: 8,
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
  section: { marginTop: 12 },
  sectionHeading: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  gridCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 10,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(78,52,46,0.12)",
  },
  gridImage: {
    width: "100%",
    height: 110,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: "rgba(78,52,46,0.18)",
    marginBottom: 8,
  },
  gridTitle: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 13,
    marginTop: 2,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(78,52,46,0.12)",
  },
  listPic: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: "rgba(78,52,46,0.18)",
    marginRight: 12,
  },
  listTitle: { color: COLORS.text, fontWeight: "700", fontSize: 15 },
  createWrap: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(78,52,46,0.12)",
    marginBottom: 12,
  },
  createInput: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 10 }),
    borderWidth: 1,
    borderColor: "rgba(78,52,46,0.18)",
    color: COLORS.text,
  },
  createBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  createBtnText: { color: COLORS.white, fontWeight: "800" },
});
