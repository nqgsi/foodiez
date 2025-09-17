import * as SecureStore from "expo-secure-store";
import instance from "./index";

export const fetchProfile = async () => {
  const userId = await SecureStore.getItemAsync("userId");
  const token = await SecureStore.getItemAsync("token");

  if (!userId || !token) throw new Error("User not authenticated");

  const res = await instance.get(`/user/get/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
