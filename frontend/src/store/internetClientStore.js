import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/internet-clients"
    : "/api/internet-clients";

axios.defaults.withCredentials = true;

export const useInternetClientStore = create((set) => ({
  internetClients: [],

  // FETCH
  fetchInternetClients: async () => {
    const res = await axios.get(`${API}/internet-clients`);
    set({ internetClients: res.data });
  },

  // CREATE
  createInternetClient: async (data) => {
    await axios.post(`${API}/internet-clients`, data);
  },

  // UPDATE
  updateInternetClient: async (id, data) => {
    await axios.put(`${API}/internet-clients/${id}`, data);
  },

  // DELETE
  deleteInternetClient: async (id) => {
    await axios.delete(`${API}/internet-clients/${id}`);
  },
}));