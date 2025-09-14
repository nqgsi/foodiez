// import { getRecipes } from "@/api/auth";
// import { useQuery } from "@tanstack/react-query";
// import React from "react";
// import {
//   ActivityIndicator,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// const Colors = {
//   background: "#DED7C6",
//   text: "#4E342E",
//   danger: "#C0392B",
// };

// type Recipe = {
//   _id: string;
//   title: string;
//   description?: string;
//   image?: string;
//   user: {
//     _id: string;
//     username: string;
//     image?: string;
//   };
//   ingredients: { name: string }[];
//   categories: { name: string }[];
// };

// const RecipeScreen = () => {
//   const {
//     data: recipes,
//     isLoading,
//     isError,
//   } = useQuery<Recipe[]>({
//     queryKey: ["recipes"],
//     queryFn: getRecipes,
//   });

//   if (isLoading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#ffffff" />
//       </View>
//     );
//   }

//   if (isError) {
//     return (
//       <View style={styles.loaderContainer}>
//         <Text style={{ color: Colors.danger, fontSize: 18 }}>
//           Failed to load recipes 😔
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
//       <ScrollView style={styles.scroll}>
//         {recipes?.map((recipe) => (
//           <View key={recipe._id} style={styles.card}>
//             <Image
//               source={{
//                 uri: recipe.image
//                   ? recipe.image
//                   : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//               }}
//               style={styles.image}
//             />
//             <Text style={styles.title}>{recipe.title}</Text>
//             {recipe.description && (
//               <Text style={styles.description}>{recipe.description}</Text>
//             )}

//             {/* User info */}
//             {recipe.user ? (
//               <View style={styles.userRow}>
//                 <Image
//                   source={{
//                     uri: recipe.user.image
//                       ? recipe.user.image
//                       : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//                   }}
//                   style={styles.userAvatar}
//                 />
//                 <Text style={styles.userName}>{recipe.user.username}</Text>
//               </View>
//             ) : (
//               <View style={styles.userRow}>
//                 <Image
//                   source={{
//                     uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
//                   }}
//                   style={styles.userAvatar}
//                 />
//                 <Text style={styles.userName}>Unknown</Text>
//               </View>
//             )}

//             {/* Ingredients */}
//             <Text style={styles.section}>Ingredients:</Text>
//             <Text>{recipe.ingredients.map((ing) => ing.name).join(", ")}</Text>

//             {/* Categories */}
//             <Text style={styles.section}>Categories:</Text>
//             <Text>{recipe.categories.map((cat) => cat.name).join(", ")}</Text>
//           </View>
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default RecipeScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.background },
//   scroll: { padding: 15 },
//   loaderContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: Colors.background,
//   },
//   card: {
//     backgroundColor: "#FFF",
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 20,
//   },
//   image: { width: "100%", height: 150, borderRadius: 10, marginBottom: 10 },
//   title: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
//   description: { fontSize: 14, marginBottom: 10, color: Colors.text },
//   userRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
//   userAvatar: { width: 30, height: 30, borderRadius: 15, marginRight: 8 },
//   userName: { fontSize: 14, color: Colors.text, fontWeight: "500" },
//   section: { fontWeight: "bold", marginTop: 5 },
// });
