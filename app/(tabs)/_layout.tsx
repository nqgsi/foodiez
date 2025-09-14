import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import React from "react";
import { StatusBar, View } from "react-native";

const Colors = {
  background: "#DED7C6",
  primary: "#7A9E7E",
  accent: "#D35400",
  text: "#4E342E",
  highlight: "#F4D03F",
  danger: "#C0392B",
};

export default function TabsLayout() {
  // <<<<<<< Updated upstream
  //   return (
  //     <View style={{ flex: 1, backgroundColor: Colors.background }}>
  //       <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

  //       <Tabs
  //         screenOptions={{
  //           headerShown: false,
  //           tabBarActiveTintColor: Colors.primary,
  //           tabBarInactiveTintColor: "#9AA0A6",
  //           tabBarStyle: {
  //             backgroundColor: Colors.background,
  //             borderTopWidth: 0,

  //             shadowColor: Colors.accent,
  //             shadowOffset: { width: 0, height: -3 },
  //             shadowOpacity: 0.3,
  //             shadowRadius: 4,

  //             elevation: 5,
  //           },
  //         }}
  //       >
  //         <Tabs.Screen
  //           name="home"
  //           options={{
  //             title: "Home",
  //             tabBarIcon: ({ color, size }) => (
  //               <Feather name="home" size={size} color={color} />
  //             ),
  //           }}
  // =======
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        {/* Status bar matches tab bar background */}
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.background}
        />

        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: "#9AA0A6",
            tabBarStyle: {
              backgroundColor: Colors.background, // Mushroom Taupe
              borderTopWidth: 0, // remove default border
              // Shadow for iOS
              shadowColor: Colors.accent, // Rust Orange
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              // Shadow for Android
              elevation: 5,
            },
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: "Home",
              tabBarIcon: ({ color, size }) => (
                <Feather name="home" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="categories"
            options={{
              title: "Categories",
              tabBarIcon: ({ color, size }) => (
                <AntDesign name="bars" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="recipes"
            options={{
              title: "Recipes",
              tabBarIcon: ({ color, size }) => (
                <Feather name="book" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color, size }) => (
                <AntDesign name="user" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </QueryClientProvider>
  );
}
