import instance from ".";
import { storeToken } from "./storage";
interface UserInfo {
  username: string;
  password: string;
}
const login = async (userInfo: UserInfo) => {
  const res = await instance.post("/", userInfo);
  await storeToken(res.data.token);
  console.log(res.data);
  return res.data;
};

const register = async (userInfo: UserInfo) => {
  const res = await instance.post("/", userInfo);
  await storeToken(res.data.token);
  console.log(res.data);

  return res.data;
};
export { login, register };
