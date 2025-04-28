import { api } from "./api";

export const createFileAPI = async (name, parentId) => {
  try {
    const response = await api.post("/file", { name, parentId });
    return response;
  } catch (error) {
    return error;
  }
};
