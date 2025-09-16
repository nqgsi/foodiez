import instance from "./index";

export const fetchProfile = async (id: string) => {
  console.log("🔄 Fetching profile...");

  const res = await instance.get(`/user/get/${id}`);
  console.log("✅ Profile fetched:", res.data);

  return res.data;
};
