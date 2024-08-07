import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7777/api/v1/auth",
  withCredentials: true,
});

export const getProfile = () => API.get("/profile");
export const refreshToken = () => API.post("/refresh-token");
