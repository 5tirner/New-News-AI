import axios from "axios";
import { getCookie } from "../utils/getCoockie";

export const getFields = async () => {
  const Access = getCookie("Access-Token");

  const response = await fetch("auth/api/getUserFields", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Token": Access
    },
    credentials: "include", 
  });
  if (!response.ok) {
    return null;
  }
  return response;
};

export const getNews = async () => {
  const response = await axios.get(`/ai/api//news/`);
  return response.data;
};

export const getProfile = async () => {
  const response = await axios.get(`/auth/api/profile`);
  return response.data;
};
