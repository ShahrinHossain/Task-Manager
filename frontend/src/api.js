// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // make sure your FastAPI backend is running here
});

export default api;
