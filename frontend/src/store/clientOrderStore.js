import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/client-orders"
    : "/api/client-orders";

axios.defaults.withCredentials = true;

export const useClientOrderStore = create((set) => ({
  orders: [],

  fetchOrders: async () => {
    const res = await axios.get(API);
    set({ orders: res.data });
  },

  createOrder: async (formData) => {
    await axios.post(API, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteOrder: async (id) => {
    await axios.delete(`${API}/${id}`);

    set((state) => ({
      orders: state.orders.filter((order) => order._id !== id),
    }));
  },
  downloadPDF: async (id) => {
    const url =
      import.meta.env.MODE === "development"
        ? `http://localhost:5000/api/client-orders/pdf/${id}`
        : `/api/client-orders/pdf/${id}`;

    const res = await fetch(url, { credentials: "include" });
    const blob = await res.blob();
    const blobURL = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobURL;
    a.download = `ClientOrder-${id}.pdf`;
    a.click();
    window.URL.revokeObjectURL(blobURL); // clean up memory
  },

  updateOrderStatus: async (id, data) => {
    const res = await axios.put(`${API}/${id}/status`, data);

    set((state) => ({
      orders: state.orders.map((order) =>
        order._id === id ? res.data : order,
      ),
    }));
  },
}));
