import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/comptes-financiers"
    : "/api/comptes-financiers";

axios.defaults.withCredentials = true;

export const useCompteStore = create((set) => ({
  comptes: [],

  fetchComptes: async () => {
    const res = await axios.get(API);
    set({ comptes: res.data });
  },

  createCompte: async (data) => {
    await axios.post(API, data);
  },

  updateCompte: async (id, data) => {
  await axios.put(`${API}/${id}`, data);
},

  deleteCompte: async (id) => {
    await axios.delete(`${API}/${id}`);
  },
}));