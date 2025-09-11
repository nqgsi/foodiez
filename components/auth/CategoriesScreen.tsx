import React from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Color system (same as other screens)
const COLORS = {
  background: "#DED7C6", // Mushroom Taupe
  primary: "#7A9E7E", // Olive Green
  accent: "#D35400", // Rust Orange
  text: "#4E342E", // Dark Brown
  white: "#FFFFFF",
  card: "#EFE9DA",
  shadow: "rgba(0,0,0,0.10)",
};

const CategoriesScreen = () => {
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
          <Text style={styles.headerTitle}>Categories</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Popular Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Popular Categories</Text>

          {/* 2-column grid */}
          <View style={styles.grid}>
            <TouchableOpacity style={styles.gridCard} activeOpacity={0.8}>
              <View style={styles.gridImage} />
              <Text style={styles.gridTitle}>Category Name</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridCard} activeOpacity={0.8}>
              <View style={styles.gridImage} />
              <Text style={styles.gridTitle}>Category Name</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridCard} activeOpacity={0.8}>
              <View style={styles.gridImage} />
              <Text style={styles.gridTitle}>Category Name</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridCard} activeOpacity={0.8}>
              <View style={styles.gridImage} />
              <Text style={styles.gridTitle}>Category Name</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* All Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>All Categories</Text>

          {/* List items */}
          <TouchableOpacity style={styles.listItem} activeOpacity={0.8}>
            <View style={styles.listPic} />
            <Text style={styles.listTitle}>Category Title</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem} activeOpacity={0.8}>
            <View style={styles.listPic} />
            <Text style={styles.listTitle}>Category Title</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem} activeOpacity={0.8}>
            <View style={styles.listPic} />
            <Text style={styles.listTitle}>Category Title</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem} activeOpacity={0.8}>
            <View style={styles.listPic} />
            <Text style={styles.listTitle}>Category Title</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoriesScreen;

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

  /* Sections */
  section: {
    marginTop: 12,
  },
  sectionHeading: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 12,
  },

  /* Grid (Popular Categories) */
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

  /* List (All Categories) */
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
  listTitle: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 15,
  },
});
