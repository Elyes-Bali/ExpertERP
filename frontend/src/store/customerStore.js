import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/customers"
    : "/api/customers";

axios.defaults.withCredentials = true;

export const useCustomerStore = create((set) => ({
  customers: [],

  // FETCH
  fetchCustomers: async () => {
    const res = await axios.get(`${API}/customers`);
    set({ customers: res.data });
  },

  // CREATE
  createCustomer: async (data) => {
    await axios.post(`${API}/customers`, data);
  },

  // UPDATE
  updateCustomer: async (id, data) => {
    await axios.put(`${API}/customers/${id}`, data);
  },

  // DELETE
  deleteCustomer: async (id) => {
    await axios.delete(`${API}/customers/${id}`);
  },
}));