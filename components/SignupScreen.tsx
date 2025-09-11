import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Color system (from your spec)
const COLORS = {
  background: "#DED7C6", // Mushroom Taupe
  primary: "#7A9E7E", // Olive Green
  accent: "#D35400", // Rust Orange
  text: "#4E342E", // Dark Brown
  white: "#FFFFFF",
  card: "#EFE9DA",
  shadow: "rgba(0,0,0,0.10)",
};

const SignupScreen = () => {
  type UserInfotype = {
    email: string;
    username: string;
    password: string;
    image: string | null;
  };
  const [userInfo, setUserInfo] = useState<UserInfotype>({
    email: "",
    username: "",
    password: "",
    image: null,
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
        backgroundColor={COLORS.background}
      />
      <View style={styles.container}>
        {/* Brand */}
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>🍲</Text>
          </View>
          <Text style={styles.brand}>Foodiez</Text>
        </View>

        {/* Headings */}
        <View style={styles.headings}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Join the community and share your favorite recipes.
          </Text>
        </View>

        {/* Sign-up Card */}
        <View style={styles.card}>
          {/* Profile Image Upload */}
          <TouchableOpacity style={styles.imageUpload} activeOpacity={0.8}>
            <Text style={styles.imageUploadText}>Upload Profile Image</Text>
          </TouchableOpacity>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="you@example.com"
              placeholderTextColor="#7a6b60"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          {/* Username */}
          <View style={[styles.inputGroup, { marginTop: 14 }]}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              placeholder="foodie123"
              placeholderTextColor="#7a6b60"
              style={styles.input}
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={[styles.inputGroup, { marginTop: 14 }]}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#7a6b60"
              secureTextEntry={true}
              style={styles.input}
            />
          </View>

          {/* Actions */}
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8}>
            <Text style={styles.primaryBtnText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.8}>
            <Text style={styles.secondaryBtnText}>
              I already have an account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 10,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  logoIcon: {
    fontSize: 18,
  },
  brand: {
    marginLeft: 10,
    fontWeight: "700",
    fontSize: 22,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  headings: {
    marginTop: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B4F45",
  },
  card: {
    marginTop: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  inputGroup: {
    width: "100%",
  },
  label: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.select({ ios: 14, android: 12 }),
    borderWidth: 1,
    borderColor: "rgba(78,52,46,0.18)",
    color: COLORS.text,
    fontSize: 15,
  },
  primaryBtn: {
    marginTop: 18,
    backgroundColor: COLORS.primary,
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
  primaryBtnText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.2,
  },
  secondaryBtn: {
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.accent,
    backgroundColor: COLORS.white,
  },
  secondaryBtnText: {
    color: COLORS.accent,
    fontWeight: "800",
    fontSize: 15,
  },
  imageUpload: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.card,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  imageUploadText: {
    color: COLORS.accent,
    fontWeight: "700",
    fontSize: 13,
    textAlign: "center",
  },
});
