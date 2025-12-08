import axios from 'axios';

const apiClient = axios.create({
  baseURL: "https://forum-backend-ea7r.onrender.com/api", // 👈 on force
  timeout: 15000
});

// const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   timeout: 15000
// });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;
