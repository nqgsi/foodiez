import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

const getToken = async () => {
  try {
    const token = await getItemAsync("token");
    return token;
  } catch (error) {}
};

const storeToken = async (token: string) => {
  try {
    await setItemAsync("token", token);
    console.log("settokendone");
  } catch (error) {
    console.error("Error storing token:", error);
  }
};

const deleteToken = async () => {
  try {
    await deleteItemAsync("token");
  } catch (error) {
    console.error("Error deleting token:", error);
  }
};

export { deleteToken, getToken, storeToken };
