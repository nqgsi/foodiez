import { login } from "@/api/auth";
import { storeToken } from "@/api/storage";
import AuthContext from "@/context/auth-context";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import React, { useContext, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const LoginScreen = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: async (res) => {
      try {
        // If response is { token: "..." } or a string
        const token = typeof res === "string" ? res : res.token;
        if (!token) throw new Error("No token received from server");

        await storeToken(token);

        // Decode JWT
        const decoded: any = jwtDecode(token);
        const userId = decoded._id;
        const username = decoded.username ?? "";

        // Store userId and username safely
        await SecureStore.setItemAsync("userId", userId);
        await SecureStore.setItemAsync("username", username);

        console.log("Logged in successfully. UserID:", userId);

        setIsAuthenticated(true);
        router.push("/(tabs)/home");
      } catch (err: any) {
        console.log("Login onSuccess error:", err);
        Alert.alert("Error", err.message || "Something went wrong");
      }
    },
    onError: (err: any) => {
      console.log("🚀 ~ LoginScreen ~ err:", err);

      if (!err.response) {
        Alert.alert("Error", "Network error, please try again");
        return;
      }

      switch (err.response.status) {
        case 400:
          Alert.alert(
            "Invalid Input",
            "Please enter a valid email and password"
          );
          break;
        case 401:
          Alert.alert("Unauthorized", "Incorrect email or password ⛔");
          break;
        case 404:
          Alert.alert(
            "Account Not Found",
            "You don't have an account. Please sign up"
          );
          break;
        default:
          Alert.alert("Error", "Something went wrong. Try again later");
      }
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome</Text>
      <Text style={styles.subheading}>Please log in to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#7A9E7E"
        onChangeText={(text) =>
          setUserInfo({ ...userInfo, email: text.trim() })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#7A9E7E"
        secureTextEntry
        onChangeText={(text) => setUserInfo({ ...userInfo, password: text })}
      />

      <TouchableOpacity style={styles.button} onPress={() => mutate(userInfo)}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't have an account?{" "}
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home")}
          style={styles.guestContainer}
        >
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DED7C6",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4E342E",
    marginBottom: 10,
  },
  subheading: { fontSize: 16, color: "#4E342E", marginBottom: 30 },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#7A9E7E",
    color: "#4E342E",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#7A9E7E",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  footer: { marginTop: 20, alignItems: "center" },
  footerText: { color: "#4E342E", fontSize: 14 },
  footerLink: { color: "#D35400", fontWeight: "bold" },
  guestContainer: { marginTop: 10 },
  guestText: { color: "#D35400", fontWeight: "bold", fontSize: 16 },
});
