import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/projects"
    : "/api/projects";

axios.defaults.withCredentials = true;

export const useProjectStore = create((set) => ({
  projects: [],
  loading: false,
  error: null,

  // 🔹 FETCH
  fetchProjects: async () => {
    try {
      const res = await axios.get(`${API}/projects`);
      set({ projects: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 CREATE
  createProject: async (data) => {
    try {
      await axios.post(`${API}/projects`, data);
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 UPDATE
  updateProject: async (id, data) => {
    try {
      await axios.put(`${API}/projects/${id}`, data);
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 DELETE
  deleteProject: async (id) => {
    try {
      await axios.delete(`${API}/projects/${id}`);
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 TOGGLE ACTIVE
  toggleProject: async (id) => {
    try {
      await axios.put(`${API}/projects/${id}/toggle`);
    } catch (err) {
      console.error(err);
    }
  },
}));