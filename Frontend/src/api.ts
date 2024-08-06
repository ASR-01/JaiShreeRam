import axios from "axios";

const API = axios.create({
  baseURL: "http://api.adityasinghrawat.com/api/v1/auth",
  withCredentials: true,
});

export const getProfile = () => API.get("/profile");
export const refreshToken = () => API.post("/refresh-token");
