import { router } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome Back</Text>
      <Text style={styles.subheading}>Please log in to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#7A9E7E"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#7A9E7E"
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/home")}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't have an account? <Text style={styles.footerLink}>Sign Up</Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DED7C6", // Mushroom Taupe
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4E342E", // Dark Brown
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    color: "#4E342E",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#7A9E7E", // Olive Green border
    color: "#4E342E",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#7A9E7E", // Olive Green
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
  },
  footerText: {
    color: "#4E342E",
  },
  footerLink: {
    color: "#D35400", // Rust Orange
    fontWeight: "bold",
  },
});
