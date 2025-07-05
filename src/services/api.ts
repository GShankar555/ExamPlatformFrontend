import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_DEV_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiService = {
  getSession: async () => {
    return await api.get("/api/auth/getSession");
  },

  getProblems: async () => {
    return await api.get("/api/user/getProblems");
  },

  runCode: async (examId: string, problemId: string, code: string, language: string) => {
    return await api.post("/api/user/runCode", { examId, problemId, code, language });
  },
};

export default apiService;
