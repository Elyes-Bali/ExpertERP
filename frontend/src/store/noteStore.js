import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/notes"
    : "/api/notes";

axios.defaults.withCredentials = true;

export const useNoteStore = create((set) => ({
  notes: [],
  loading: false,
  error: null,

  // 🔹 FETCH
  fetchNotes: async () => {
    try {
      const res = await axios.get(`${API}/notes`);
      set({ notes: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 CREATE
  createNote: async (data) => {
    try {
      await axios.post(`${API}/notes`, data);
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 UPDATE
  updateNote: async (id, data) => {
    try {
      await axios.put(`${API}/notes/${id}`, data);
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 DELETE
  deleteNote: async (id) => {
    try {
      await axios.delete(`${API}/notes/${id}`);
    } catch (err) {
      console.error(err);
    }
  },


}));