// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Category, deleteCategory, getCategories } from "../api/categories";

// const CategoriesScreen = () => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);

//   const loadCategories = async () => {
//     setLoading(true);
//     try {
//       const data = await getCategories();
//       setCategories(Array.isArray(data) ? data : []);
//     } catch (err: any) {
//       Alert.alert("Error", err?.message || "Failed to load categories");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadCategories();
//   }, []);

//   if (loading)
//     return (
//       <ActivityIndicator size="large" color="#7A9E7E" style={{ flex: 1 }} />
//     );

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <ScrollView contentContainerStyle={{ padding: 20 }}>
//         <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
//           Categories
//         </Text>
//         {categories.length === 0 && <Text>No categories yet.</Text>}
//         {categories.map((cat) => (
//           <TouchableOpacity
//             key={cat._id}
//             style={{
//               marginBottom: 12,
//               flexDirection: "row",
//               alignItems: "center",
//             }}
//             onLongPress={async () => {
//               Alert.alert("Delete", "Delete this category?", [
//                 { text: "Cancel", style: "cancel" },
//                 {
//                   text: "Delete",
//                   style: "destructive",
//                   onPress: async () => {
//                     try {
//                       await deleteCategory(cat._id);
//                       loadCategories();
//                     } catch (e: any) {
//                       Alert.alert("Error", e?.message || "Delete failed");
//                     }
//                   },
//                 },
//               ]);
//             }}
//           >
//             {cat.image ? (
//               <Image
//                 source={{ uri: cat.image }}
//                 style={{
//                   width: 50,
//                   height: 50,
//                   borderRadius: 8,
//                   marginRight: 12,
//                 }}
//               />
//             ) : (
//               <View
//                 style={{
//                   width: 50,
//                   height: 50,
//                   backgroundColor: "#EEE",
//                   borderRadius: 8,
//                   marginRight: 12,
//                 }}
//               />
//             )}
//             <Text style={{ fontSize: 16 }}>{cat.name}</Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default CategoriesScreen;
