import { register } from "@/api/auth";
import { storeToken } from "@/api/storage";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  background: "#DED7C6",
  primary: "#7A9E7E",
  accent: "#D35400",
  text: "#4E342E",
  white: "#FFFFFF",
  card: "#EFE9DA",
  shadow: "rgba(0,0,0,0.10)",
};

const SignupScreen = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    username: "",
    password: "",
    image: "",
  });

  // Form validation function
  const validateForm = () => {
    const { email, username, password } = userInfo;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }

    // Password validation
    if (password.length < 8) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 8 characters long."
      );
      return false;
    }

    // Username validation
    if (!username) {
      Alert.alert("Invalid Username", "Username cannot be empty.");
      return false;
    }

    return true;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: register,
    onSuccess: async (data) => {
      console.log("Sign up successfully:", data);
      setUserInfo({
        email: "",
        username: "",
        password: "",
        image: "",
      });
      storeToken(data.token);
      router.push("/(tabs)/home");
    },
    onError: (err: any) => {
      if (isAxiosError(err)) {
        const message = err.response?.data?.message;

        if (
          message === "Email already exists!" ||
          message === "Username already exists!"
        ) {
          Alert.alert("Account Exists", message);
        } else {
          Alert.alert("Error", "Something went wrong. Please try again.");
        }

        console.error("Axios error:", err.message);
        console.error("Status code:", err.response?.status);
        console.error("Response data:", err.response?.data);
      }
    },
  });

  const handleSubmit = () => {
    if (!validateForm()) return; // Stop submission if validation fails

    const formdata = new FormData();
    formdata.append("email", userInfo.email);
    formdata.append("username", userInfo.username);
    formdata.append("password", userInfo.password);

    if (userInfo.image) {
      formdata.append("image", {
        uri: userInfo.image,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);
    }

    mutate(formdata);
  };

  const pickImage = async () => {
    // Request permission for the image
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const asset = result.assets[0];
      setUserInfo({ ...userInfo, image: asset.uri });
    }
  };

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
          <TouchableOpacity
            style={styles.imageUpload}
            activeOpacity={0.8}
            onPress={pickImage}
          >
            {userInfo.image ? (
              <Image
                source={{ uri: userInfo.image }}
                style={styles.profileImage}
              />
            ) : (
              <Text style={styles.imageUploadText}>Upload Profile Image</Text>
            )}
          </TouchableOpacity>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="you@example.com"
              placeholderTextColor="rgba(122, 107, 96, 0.3)"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
            />
          </View>

          {/* Username */}
          <View style={[styles.inputGroup, { marginTop: 14 }]}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              placeholder="foodie123"
              placeholderTextColor="rgba(122, 107, 96, 0.3)"
              style={styles.input}
              autoCapitalize="none"
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, username: text })
              }
            />
          </View>

          {/* Password */}
          <View style={[styles.inputGroup, { marginTop: 14 }]}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="rgba(122, 107, 96, 0.3)"
              secureTextEntry={true}
              style={styles.input}
              onChangeText={(text) =>
                setUserInfo({ ...userInfo, password: text })
              }
            />
          </View>

          {/* Actions */}
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.8}
            onPress={handleSubmit}
            disabled={isPending}
          >
            <Text style={styles.primaryBtnText}>
              {isPending ? "Creating..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.8}
            onPress={() => router.push("..")}
          >
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
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 8, gap: 10 },
  brandRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
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
  logoIcon: { fontSize: 18 },
  brand: {
    marginLeft: 10,
    fontWeight: "700",
    fontSize: 22,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  headings: { marginTop: 8 },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  subtitle: { marginTop: 6, fontSize: 14, color: "#6B4F45" },
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
  inputGroup: { width: "100%" },
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
    borderColor: "rgba(134, 45, 26, 0.18)",
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
  secondaryBtnText: { color: COLORS.accent, fontWeight: "800", fontSize: 15 },
  profileImage: { width: "100%", height: "100%", borderRadius: 60 },
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
