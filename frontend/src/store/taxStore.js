import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/tax"
    : "/api/tax";

 

axios.defaults.withCredentials = true;


export const useTaxStore = create((set) => ({
  taxes: [],
  vat: null,

  fetchTaxes: async () => {
    const res = await axios.get(`${API}/tax`, { withCredentials: true });
    set({ taxes: res.data });
  },

  createTax: async (data) => {
    await axios.post(`${API}/tax`, data, { withCredentials: true });
  },

  toggleTax: async (id) => {
    await axios.put(`${API}/tax/${id}/toggle`, {}, { withCredentials: true });
  },

    updateTax: async (id, data) => {
    await axios.put(`${API}/tax/${id}`, data);
  },

  deleteTax: async (id) => {
    await axios.delete(`${API}/tax/${id}`);
  },

  // VAT
  fetchVAT: async () => {
    const res = await axios.get(`${API}/vat`, { withCredentials: true });
    set({ vat: res.data });
  },

  setVAT: async (data) => {
    const res = await axios.post(`${API}/vat`, data, { withCredentials: true });
    set({ vat: res.data });
  },

    updateVAT: async (data) => {
    const res = await axios.put(`${API}/vat`, data);
    set({ vat: res.data });
  },

  deleteVAT: async () => {
    await axios.delete(`${API}/vat`);
    set({ vat: null });
  },
}));