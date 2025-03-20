import axios from "axios";

export const getFields = async () => {
  const response = await axios.get(`/auth/api//fields/`);
  return response.data;
};

export const getNews = async () => {
  const response = await axios.get(`/ai/api//news/`);
  return response.data;
};

export const getProfile = async () => {
  const response = await axios.get(`/auth/api/profile`);
  return response.data;
};
