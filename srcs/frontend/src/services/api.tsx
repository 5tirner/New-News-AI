import axios from "axios";

// const API_URL = '';

export const getTeams = async () => {
  const response = await axios.get(`/teams/`);
  return response.data;
};

export const getTournaments = async () => {
  const response = await axios.get(`/tournaments/`);
  return response.data;
};

export const getProfile = async () => {
  const response = await axios.get(`/auth/api/profile`);
  return response.data;
};
