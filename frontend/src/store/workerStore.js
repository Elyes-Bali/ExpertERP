import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/workers"
    : "/api/workers";

axios.defaults.withCredentials = true;

export const useWorkerStore = create((set) => ({
  workers: [],
  payments: [],

fetchWorkers: async () => {
  try {
    const res = await axios.get(`${API}`); // No ID needed in URL
    set({ workers: Array.isArray(res.data) ? res.data : [] });
  } catch (err) {
    set({ workers: [] });
  }
},

  createWorker: async (data) => {
    const res = await axios.post(`${API}`, data);
    set((state) => ({
      workers: [...state.workers, res.data],
    }));
  },

fetchPayments: async () => {
  try {
    const res = await axios.get(`${API}/payments`); // No ID needed in URL
    set({ payments: Array.isArray(res.data) ? res.data : [] });
  } catch (err) {
    set({ payments: [] });
  }
},

  paySalary: async (data) => {
    const res = await axios.post(`${API}/pay`, data);
    set((state) => ({
      payments: [...state.payments, res.data],
    }));
  },


  updateWorker: async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data);

  set((state) => ({
    workers: state.workers.map((w) =>
      w._id === id ? res.data : w
    ),
  }));
},

deleteWorker: async (id) => {
  await axios.delete(`${API}/${id}`);

  set((state) => ({
    workers: state.workers.filter((w) => w._id !== id),
  }));
},


}));