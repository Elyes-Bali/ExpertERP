import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/materials"
    : "/api/materials";

axios.defaults.withCredentials = true;

export const useMaterialStore = create((set) => ({
  materials: [],
  loading: false,
  error: null,

  // 🔹 FETCH
  fetchMaterials: async () => {
    try {
      const res = await axios.get(`${API}/materials`);
      set({ materials: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 CREATE
  createMaterial: async (data) => {
    try {
      await axios.post(`${API}/materials`, data);
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 UPDATE
  updateMaterial: async (id, data) => {
    try {
      await axios.put(`${API}/materials/${id}`, data);
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 DELETE
  deleteMaterial: async (id) => {
    try {
      await axios.delete(`${API}/materials/${id}`);
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 TOGGLE ACTIVE
  toggleMaterial: async (id) => {
    try {
      await axios.put(`${API}/materials/${id}/toggle`);
    } catch (err) {
      console.error(err);
    }
  },
}));