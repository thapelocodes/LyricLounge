import apiBase from "./apiBase";

export const fetchUserProfile = async () => {
  const response = await apiBase.get("/users/profile");
  return response.data;
};

export const updateUserProfile = async (data) => {
  const response = await apiBase.put("/users/profile", data);
  return response.data;
};

export default apiBase;
