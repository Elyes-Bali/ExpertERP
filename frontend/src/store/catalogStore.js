import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/catalog"
    : "/api/catalog";

axios.defaults.withCredentials = true;

export const useCatalogStore = create((set) => ({
  categories: [],
  units: [],
  brands: [],

  /////////////////////////
  // CATEGORY
  /////////////////////////
  fetchCategories: async () => {
    const res = await axios.get(`${API}/categories`);
    set({ categories: res.data });
  },

  createCategory: async (data) => {
    await axios.post(`${API}/categories`, data);
  },

  updateCategory: async (id, data) => {
    await axios.put(`${API}/categories/${id}`, data);
  },

  deleteCategory: async (id) => {
    await axios.delete(`${API}/categories/${id}`);
  },

  /////////////////////////
  // UNITS
  /////////////////////////
  fetchUnits: async () => {
    const res = await axios.get(`${API}/units`);
    set({ units: res.data });
  },

  createUnit: async (data) => {
    await axios.post(`${API}/units`, data);
  },

  updateUnit: async (id, data) => {
    await axios.put(`${API}/units/${id}`, data);
  },

  deleteUnit: async (id) => {
    await axios.delete(`${API}/units/${id}`);
  },

  /////////////////////////
  // BRANDS
  /////////////////////////
  fetchBrands: async () => {
    const res = await axios.get(`${API}/brands`);
    set({ brands: res.data });
  },

  createBrand: async (data) => {
    await axios.post(`${API}/brands`, data);
  },

  updateBrand: async (id, data) => {
    await axios.put(`${API}/brands/${id}`, data);
  },

  deleteBrand: async (id) => {
    await axios.delete(`${API}/brands/${id}`);
  },
}));