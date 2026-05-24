import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/journal-comptable"
    : "/api/journal-comptable";

axios.defaults.withCredentials = true;

export const useJournalComptableStore = create((set) => ({
  journals: [],

  fetchJournals: async () => {
    const res = await axios.get(API);
    set({ journals: res.data });
  },

  createJournal: async (data) => {
    await axios.post(API, data);
  },

  updateJournal: async (id, data) => {
    await axios.put(`${API}/${id}`, data);
  },

  deleteJournal: async (id) => {
    await axios.delete(`${API}/${id}`);
  },
}));