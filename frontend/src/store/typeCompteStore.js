import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/type-comptes"
    : "/api/type-comptes";

axios.defaults.withCredentials = true;

export const useTypeCompteStore = create((set) => ({
  typeComptes: [],

  fetchTypeComptes: async () => {
    const res = await axios.get(API);
    set({ typeComptes: res.data });
  },

  createTypeCompte: async (data) => {
    await axios.post(API, data);
  },

  updateTypeCompte: async (id, data) => {
    await axios.put(`${API}/${id}`, data);
  },

  deleteTypeCompte: async (id) => {
    await axios.delete(`${API}/${id}`);
  },
}));