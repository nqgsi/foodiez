import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "log in" }} />
      <Stack.Screen
        name="(tabs)"
        options={{ title: "Home", headerShown: false }}
      />
    </Stack>
  );
}
