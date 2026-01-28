import axios from "axios";

const plainApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default plainApi;
