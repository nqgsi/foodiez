import axios from "axios";
import * as SecureStore from "expo-secure-store";

const baseURL = "http://192.168.14.27:8000";
export { baseURL };

const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

instance.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

console.log("AXIOS BASE URL =>", instance.defaults.baseURL);
export default instance;

// const DEV_PORT = process.env.EXPO_PUBLIC_DEV_PORT || "8000";

// function getExpoHost(): string | null {
//   const fromHostUri = Constants.expoConfig?.hostUri?.split(":")[0];
//   if (fromHostUri) return fromHostUri;

//   const dbg = Constants.manifest?.debuggerHost as string | undefined;
//   if (dbg) return dbg.split(":")[0];

//   return null;
// }

// function resolveBaseURL(): string {
//   const PROD = process.env.EXPO_PUBLIC_API_URL;
//   if (!__DEV__ && PROD) return PROD;

//   const host = getExpoHost();
//   if (host) return `http://${host}:${DEV_PORT}`;

//   if (Platform.OS === "android") return `http://10.0.2.2:${DEV_PORT}`;
//   return `http://localhost:${DEV_PORT}`;
// }

// const BASE_URL = resolveBaseURL();

// export const instance = axios.create({
//   baseURL: BASE_URL,
//   timeout: 15000,
// });

// instance.interceptors.request.use(async (config) => {
//   const token = await getToken();
//   if (token) config.headers.Authorization = `Bearer ${token}`;
// =======
