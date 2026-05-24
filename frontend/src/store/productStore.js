import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/products"
    : "/api/products";

axios.defaults.withCredentials = true;

export const useProductStore = create((set) => ({
  products: [],

  fetchProducts: async () => {
    const res = await axios.get(`${API}/products`);
    set({ products: res.data });
  },

  createProduct: async (data) => {
    await axios.post(`${API}/products`, data);
  },

  updateProduct: async (id, data) => {
    await axios.put(`${API}/products/${id}`, data);
  },
 
  deleteProduct: async (id) => {
    await axios.delete(`${API}/products/${id}`);
  },

importProducts: async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  await axios.post(`${API}/products/import`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
},

}));