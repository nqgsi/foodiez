import instance from "./index";

export type Ingredient = {
  _id: string;
  name: string;
  recipes?: any[];
};

export async function getIngredients(): Promise<Ingredient[]> {
  const { data } = await instance.get("/ingredients");
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.ingredients)) return data.ingredients;
  return [];
}

export async function createIngredient(name: string): Promise<Ingredient> {
  const { data } = await instance.post("/ingredients", { name });
  return data as Ingredient;
}

export async function deleteIngredient(id: string) {
  const { data } = await instance.delete(`/ingredients/${id}`);
  return data;
}
