import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const COLORS = {
  background: "#DED7C6",
  primary: "#7A9E7E",
  accent: "#D35400",
  text: "#4E342E",
  white: "#FFFFFF",
  card: "#EFE9DA",
  badge: "#F4D03F",
  shadow: "rgba(0,0,0,0.10)",
};

type Props = {
  title: string;
  image?: string;
  onPress?: () => void;
};

export default function RecipeCard({ title, image, onPress }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.cardImage}>
        {image ? <Image source={{ uri: image }} style={styles.img} /> : null}
      </View>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(78,52,46,0.12)",
  },
  cardImage: {
    width: "100%",
    height: 110,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: "rgba(78,52,46,0.18)",
    marginBottom: 8,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  img: { width: "100%", height: "100%" },
  cardTitle: { color: COLORS.text, fontWeight: "700", fontSize: 13 },
});
