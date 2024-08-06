import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7777/api/v1/auth",
  withCredentials: true,
});

interface RegistrationData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const register = (data: RegistrationData) => API.post("/register", data);
export const login = (data: LoginData) => API.post("/login", data);
export const getProfile = () => API.get("/profile");
export const refreshToken = () => API.post("/refresh-token");
