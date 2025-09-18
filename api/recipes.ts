import instance, { baseURL } from "./index";

export type RecipeDTO = {
  __optimistic: any;
  _id: string;
  title: string;
  description?: string;
  image?: string;
  user?: { _id: string; username: string; image?: string };
  ingredients: { _id?: string; name: string }[];
  categories: { _id?: string; name: string }[];
  createdAt?: string;
  updatedAt?: string;
};
const RECIPES_PATH = "/recipes";

const normalizeImage = (img?: string) => {
  if (!img) return undefined;
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  return `${baseURL.replace(/\/$/, "")}/uploads/${img.replace(/^\/+/, "")}`;
};

export async function getRecipes(): Promise<RecipeDTO[]> {
  const { data } = await instance.get(RECIPES_PATH);
  const arr: RecipeDTO[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.recipes)
    ? data.recipes
    : [];
  return arr.map((r) => ({ ...r, image: normalizeImage(r.image) }));
}

export async function createRecipe({
  title,
  description,
  categoryIds = [],
  ingredientIds = [],
  imageUri,
}: {
  title: string;
  description?: string;
  categoryIds?: string[];
  ingredientIds?: string[];
  imageUri?: string | null;
}): Promise<RecipeDTO> {
  const form = new FormData();

  form.append("title", title);
  if (description) form.append("description", description);

  categoryIds.forEach((id) => form.append("categories", id));
  ingredientIds.forEach((id) => form.append("ingredients", id));

  if (imageUri) {
    const filename = imageUri.split("/").pop() || `recipe_${Date.now()}.jpg`;
    const ext = filename.split(".").pop()?.toLowerCase();
    const type =
      ext === "png"
        ? "image/png"
        : ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : "application/octet-stream";

    // @ts-ignore React Native file
    form.append("image", { uri: imageUri, name: filename, type });
  }

  const { data } = await instance.post(RECIPES_PATH, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return { ...(data as RecipeDTO), image: normalizeImage(data?.image) };
}
export async function deleteRecipe(id: string) {
  try {
    const res = await instance.delete(`/recipes/${id}`);

    return res.data;
  } catch (error) {
    throw error;
  }
}
