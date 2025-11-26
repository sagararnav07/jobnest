import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("jn_token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("jn_token");
    delete api.defaults.headers.common.Authorization;
  }
};

export const loadStoredToken = () => {
  const token = localStorage.getItem("jn_token");
  if (token) {
    setAuthToken(token);
  }
  return token;
};

export const unwrap = async (requestPromise) => {
  try {
    const { data } = await requestPromise;
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Unexpected server error";
    throw new Error(message);
  }
};

export default api;


