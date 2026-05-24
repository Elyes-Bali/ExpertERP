import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/warehouses"
    : "/api/warehouses";

axios.defaults.withCredentials = true;

export const useWarehouseStore = create((set) => ({
  warehouses: [],
  loading: false,
  error: null,

  // 🔹 FETCH
  fetchWarehouses: async () => {
    try {
      const res = await axios.get(`${API}/warehouses`);
      set({ warehouses: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 CREATE
  createWarehouse: async (data) => {
    try {
      await axios.post(`${API}/warehouses`, data);
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 UPDATE
  updateWarehouse: async (id, data) => {
    try {
      await axios.put(`${API}/warehouses/${id}`, data);
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 DELETE
  deleteWarehouse: async (id) => {
    try {
      await axios.delete(`${API}/warehouses/${id}`);
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 TOGGLE ACTIVE
  toggleWarehouse: async (id) => {
    try {
      await axios.put(`${API}/warehouses/${id}/toggle`);
    } catch (err) {
      console.error(err);
    }
  },
}));