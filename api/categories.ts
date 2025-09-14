// import instance from "./index";
// console.log("AXIOS BASE URL =>", instance.defaults.baseURL);
// export type Category = {
//   _id: string;
//   name: string;
//   image?: string;
//   recipes?: Array<any>;
//   recipesCount?: number;
//   createdAt?: string;
//   updatedAt?: string;
// };

// export async function getCategories(): Promise<Category[]> {
//   const res = await instance.get("/categories");
//   const data = res.data;
//   if (Array.isArray(data)) return data;
//   if (data && Array.isArray(data.categories)) return data.categories;
//   console.log("getCategories(): unexpected payload", {
//     type: typeof data,
//     keys: data && typeof data === "object" ? Object.keys(data) : null,
//     sample: String(data).slice(0, 200),
//   });
//   return [];
// }

// export async function createCategory(name: string, image?: any) {
//   const formData = new FormData();
//   formData.append("name", name);
//   if (image) {
//     formData.append("image", {
//       uri: image.uri,
//       name: image.fileName || "photo.jpg",
//       type: image.type || "image/jpeg",
//     } as any);
//   }
//   const res = await instance.post("/categories", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return res.data as Category;
// }

// export async function deleteCategory(id: string) {
//   const res = await instance.delete(`/categories/${id}`);
//   return res.data;
// }
