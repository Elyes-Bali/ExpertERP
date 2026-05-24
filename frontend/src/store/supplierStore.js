import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/suppliers"
    : "/api/suppliers";

axios.defaults.withCredentials = true;

export const useSupplierStore = create((set) => ({
  suppliers: [],

  // FETCH
  fetchSuppliers: async () => {
    const res = await axios.get(`${API}/suppliers`);
    set({ suppliers: res.data });
  },

  // CREATE
  createSupplier: async (data) => {
    await axios.post(`${API}/suppliers`, data);
  },

  // UPDATE
  updateSupplier: async (id, data) => {
    await axios.put(`${API}/suppliers/${id}`, data);
  },

  // DELETE
  deleteSupplier: async (id) => {
    await axios.delete(`${API}/suppliers/${id}`);
  },
}));