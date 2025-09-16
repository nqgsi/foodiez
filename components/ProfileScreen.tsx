import { fetchProfile } from "@/api/profile";
import AuthContext from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useContext } from "react";
import {
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
// Color system (same as Signup)
const COLORS = {
  background: "#DED7C6", // Mushroom Taupe
  primary: "#7A9E7E", // Olive Green
  accent: "#D35400", // Rust Orange
  text: "#4E342E", // Dark Brown
  white: "#FFFFFF",
  card: "#EFE9DA",
  shadow: "rgba(0,0,0,0.10)",
};

const ProfileScreen = () => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("token");
    setIsAuthenticated(false);
    router.dismissTo("/");
  };
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
        backgroundColor={COLORS.background}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.8}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Profile Image */}
        <TouchableOpacity style={styles.avatarWrap} activeOpacity={0.8}>
          <Text style={styles.avatarEmoji}>👤</Text>
          <View style={styles.cameraBadge}>
            <Text style={styles.cameraIcon}>📷</Text>
          </View>
        </TouchableOpacity>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Bio</Text>
          <TextInput
            style={styles.bioInput}
            placeholder=" "
            placeholderTextColor="#7a6b60"
            multiline
            editable
          />
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>—</Text>
            <Text style={styles.statLabel}>Published Recipes</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>—</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
        </View>

        {/* My Recipes */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>My Recipes</Text>

          {/* Card 1 */}
          <TouchableOpacity style={styles.recipeCard} activeOpacity={0.8}>
            <View style={styles.recipeImagePlaceholder} />
            <View style={styles.recipeRight}>
              <View style={styles.skelTitle} />
              <View style={styles.skelLine} />
              <View style={[styles.skelLine, { width: "70%" }]} />
            </View>
          </TouchableOpacity>

          {/* Card 2 */}
          <TouchableOpacity style={styles.recipeCard} activeOpacity={0.8}>
            <View style={styles.recipeImagePlaceholder} />
            <View style={styles.recipeRight}>
              <View style={styles.skelTitle} />
              <View style={styles.skelLine} />
              <View style={[styles.skelLine, { width: "70%" }]} />
            </View>
          </TouchableOpacity>

          {/* Card 3 */}
          <TouchableOpacity style={styles.recipeCard} activeOpacity={0.8}>
            <View style={styles.recipeImagePlaceholder} />
            <View style={styles.recipeRight}>
              <View style={styles.skelTitle} />
              <View style={styles.skelLine} />
              <View style={[styles.skelLine, { width: "70%" }]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  /* Header */
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
  backIcon: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "800",
  },

  /* Avatar */
  avatarWrap: {
    alignSelf: "center",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.accent,
    marginTop: 8,
    marginBottom: 16,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  cameraBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  cameraIcon: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
  },

  /* Sections */
  section: {
    marginTop: 8,
  },
  sectionLabel: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 8,
  },
  sectionHeading: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 10,
  },

  /* Bio Input */
  bioInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 90,
    borderWidth: 1,
    borderColor: "rgba(78,52,46,0.18)",
    color: COLORS.text,
  },

  /* Stats */
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(78,52,46,0.12)",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B4F45",
    textAlign: "center",
  },

  /* Recipe cards */
  recipeCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(78,52,46,0.12)",
  },
  recipeImagePlaceholder: {
    width: 74,
    height: 74,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: "rgba(78,52,46,0.18)",
  },
  recipeRight: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  skelTitle: {
    height: 16,
    borderRadius: 6,
    backgroundColor: COLORS.card,
    marginBottom: 8,
    width: "60%",
  },
  skelLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.card,
    marginTop: 6,
    width: "85%",
  },

  /* Logout */
  logoutBtn: {
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
