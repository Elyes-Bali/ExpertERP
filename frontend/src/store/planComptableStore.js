import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/plan-comptable"
    : "/api/plan-comptable";

axios.defaults.withCredentials = true;

export const usePlanStore = create((set) => ({
  plans: [],

  fetchPlans: async () => {
    const res = await axios.get(API);
    set({ plans: res.data });
  },

  createPlan: async (data) => {
    await axios.post(API, data);
  },

  updatePlan: async (id, data) => {
    await axios.put(`${API}/${id}`, data);
  },

  deletePlan: async (id) => {
    await axios.delete(`${API}/${id}`);
  },
}));