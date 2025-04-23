import axios from 'axios';
import Cookies from 'js-cookie';
// FOR BASE URL: USE 'http://localhost:8000'
const API = import.meta.env.VITE_API_URL || 'http://0.0.0.0:8080' || "http://127.0.0.1:8000";
const axiosInstance = axios.create({
	baseURL: API + "/",
	withCredentials: true,
  });

  axiosInstance.get("api/accounts/get_csrf_cookie/");

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("csrftoken");
  if (token) config.headers["X-CSRFToken"] = token;
  return config;
});

export default axiosInstance;