import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/contract-types"
    : "/api/contract-types";

axios.defaults.withCredentials = true;

export const useContractTypeStore = create((set) => ({
  contractTypes: [],
  loading: false,
  error: null,

  // 🔹 FETCH
  fetchContractTypes: async () => {
    try {
      const res = await axios.get(`${API}/contract-types`);
      set({ contractTypes: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 CREATE
  createContractType: async (data) => {
    try {
      await axios.post(`${API}/contract-types`, data);
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 UPDATE
  updateContractType: async (id, data) => {
    try {
      await axios.put(`${API}/contract-types/${id}`, data);
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 DELETE
  deleteContractType: async (id) => {
    try {
      await axios.delete(`${API}/contract-types/${id}`);
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 TOGGLE ACTIVE
  toggleContractType: async (id) => {
    try {
      await axios.put(`${API}/contract-types/${id}/toggle`);
    } catch (err) {
      console.error(err);
    }
  },
}));