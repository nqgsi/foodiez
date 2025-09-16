import CreateRecipeScreen from "@/components/CreateRecipeScreen";
import { useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";

export default function createRecipe() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  return <CreateRecipeScreen />;
}
