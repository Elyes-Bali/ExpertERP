import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/technical-services"
    : "/api/technical-services";

axios.defaults.withCredentials = true;

export const useTechnicalServiceStore = create((set, get) => ({
  services: [],

  setServices: (services) => set({ services }),

  fetchServices: async () => {
    const res = await axios.get(API);
    set({ services: res.data });
  },

  createService: async (data) => {
    const res = await axios.post(API, data);

    // 👇 instantly add new service to UI
    set((state) => ({
      services: [res.data, ...state.services],
    }));
  },

  deleteService: async (id) => {
    await axios.delete(`${API}/${id}`);

    // ❗ remove instantly from state (NO reload needed)
    set((state) => ({
      services: state.services.filter((s) => s._id !== id),
    }));
  },


updateService: async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data);

  set((state) => ({
    services: state.services.map((s) =>
      s._id === id ? res.data : s
    ),
  }));

  return res.data;
},

  markAsPaid: async (id) => {
    const res = await axios.put(`${API}/${id}/pay`, {
      paidStatus: "paid",
      paymentDate: new Date(),
    });

    set((state) => ({
      services: state.services.map((s) =>
        s._id === id ? res.data : s
      ),
    }));

    return res.data;
  },

downloadServicePDF: async (id) => {
  const res = await axios.get(`${API}/${id}/pdf`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `TechnicalService-${id}.pdf`);

  document.body.appendChild(link);
  link.click();
  link.remove();

  // cleanup memory (important)
  window.URL.revokeObjectURL(url);
},


}));