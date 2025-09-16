import instance from "./index";
import { storeToken } from "./storage";
interface UserInfo {
  email: string;
  password: string;
}
const login = async (userInfo: UserInfo) => {
  const response = await instance.post("/sign/in", userInfo);
  await storeToken(response.data.token);

  console.log("🚀 ~ login ~ response:", response.data.token);

  return response.data;
};

const register = async (userInfo: FormData) => {
  const res = await instance.post("/sign/up", userInfo);
  await storeToken(res.data.token);
  console.log(res.data);

  return res.data;
};
const getUsers = async () => {
  const res = await instance.get("/user/get");
  return res.data;
};

export interface Recipe {
  _id: string;
  title: string;
  image?: string;
  time: string;
  difficulty: string;
  user: { _id: string; username: string; image?: string } | null;
  ingredients: string;
  categories: string;
}

const getRecipes = async () => {
  try {
    const res = await instance.get("/recipes");
    return res.data || [];
  } catch (error) {
    console.log("🚀 ~ getRecipes ~ error:", error);
    return [];
  }
};

export { getRecipes, getUsers, login, register };
