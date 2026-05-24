import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/machine-types"
    : "/api/machine-types";

axios.defaults.withCredentials = true;

export const useMachineTypeStore = create((set) => ({
  machineTypes: [],
  loading: false,
  error: null,

  // 🔹 FETCH
  fetchMachineTypes: async () => {
    try {
      const res = await axios.get(`${API}/machine-types`);
      set({ machineTypes: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 CREATE
  createMachineType: async (data) => {
    try {
      await axios.post(`${API}/machine-types`, data);
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 UPDATE
  updateMachineType: async (id, data) => {
    try {
      await axios.put(`${API}/machine-types/${id}`, data);
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 DELETE
  deleteMachineType: async (id) => {
    try {
      await axios.delete(`${API}/machine-types/${id}`);
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 TOGGLE ACTIVE
  toggleMachineType: async (id) => {
    try {
      await axios.put(`${API}/machine-types/${id}/toggle`);
    } catch (err) {
      console.error(err);
    }
  },
}));