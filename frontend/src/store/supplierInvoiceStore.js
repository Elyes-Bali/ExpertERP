import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/supplier-invoices"
    : "/api/supplier-invoices";

axios.defaults.withCredentials = true;

export const useInvoiceStore = create((set) => ({
  invoices: [],

  fetchInvoices: async () => {
    const res = await axios.get(API);
    set({ invoices: res.data });
  },

  createInvoice: async (formData) => {
    await axios.post(API, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

deleteInvoice: async (id) => {
  await axios.delete(`${API}/${id}`);

  set((state) => ({
    invoices: state.invoices.filter((inv) => inv._id !== id),
  }));
},
  downloadPDF: async (id) => {
    const url =
      import.meta.env.MODE === "development"
        ? `http://localhost:5000/api/supplier-invoices/pdf/${id}`
        : `/api/supplier-invoices/pdf/${id}`;

    const res = await fetch(url, { credentials: "include" });
    const blob = await res.blob();
    const blobURL = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobURL;
    a.download = `Invoice-${id}.pdf`;
    a.click();
    window.URL.revokeObjectURL(blobURL); // clean up memory
  },

  updateInvoiceStatus: async (id, isPaid) => {
  const res = await axios.put(`${API}/${id}/status`, { isPaid });

  set((state) => ({
    invoices: state.invoices.map((inv) =>
      inv._id === id ? res.data : inv
    ),
  }));
},
}));
