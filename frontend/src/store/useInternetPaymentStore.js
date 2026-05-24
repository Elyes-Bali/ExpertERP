import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/internet-payments"
    : "/api/internet-payments";

axios.defaults.withCredentials = true;

export const useInternetPaymentStore = create((set) => ({
  payments: [],
  history: [],
  clients: [], // ✅ ADD THIS
  contracts: [],

  fetchPayments: async () => {
    const res = await axios.get(API);

    set({
      payments: res.data,
    });
  },

//   createPayment: async (data) => {
//     const res = await axios.post(API, data);

//     set((state) => ({
//       payments: [res.data, ...state.payments],
//     }));
//   },

createPayment: async (data) => {
  const res = await axios.post(API, data);

  set((state) => ({
    payments: [res.data, ...state.payments],
  }));

  return res.data;
},


fetchClientHistory: async (clientId) => {
  const res = await axios.get(`${API}/client/${clientId}`);

  set({ history: res.data });

  return res.data; // 👈 IMPORTANT
},

  deletePayment: async (id) => {
    await axios.delete(`${API}/${id}`);

    set((state) => ({
      payments: state.payments.filter((p) => p._id !== id),
    }));
  },


  downloadPaymentPDF: async (id) => {
  const res = await axios.get(`${API}/${id}/pdf`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `InternetPayment-${id}.pdf`);

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
},
}));
