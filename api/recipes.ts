import instance from "./index";
export type RecipeDTO = {
  _id: string;
  title: string;
  description?: string;
  image?: string; // backend may return relative or absolute URL
  user?: { _id: string; username: string; image?: string };
  ingredients: { name: string }[];
  categories: { name: string }[];
};
export type CreateRecipeDTO = {
  title: string;
  description?: string;
  ingredients: string[]; // or { name: string }[] depending on backend
  categories: string[];
  image?: { uri: string; type: string; name: string }; // for RN image upload
};
export const getRecipeById = async (id: string) => {
  console.log("🔄 Fetching recipes...");

  const res = await instance.get(`/recipes/${id}`);
  console.log("✅ recipes fetched:", res.data);

  return res.data;
};
export const createRecipe = async (
  data: CreateRecipeDTO
): Promise<RecipeDTO> => {
  const formData = new FormData();

  formData.append("title", data.title);
  if (data.description) formData.append("description", data.description);

  data.ingredients.forEach((ingredient, i) => {
    formData.append(`ingredients[${i}]`, ingredient);
  });

  data.categories.forEach((category, i) => {
    formData.append(`categories[${i}]`, category);
  });

  if (data.image) {
    formData.append("image", {
      uri: data.image.uri,
      type: data.image.type,
      name: data.image.name,
    } as any);
  }

  const res = await instance.post("/recipes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  console.log("✅ Recipe created:", res.data);
  return res.data as RecipeDTO;
};
