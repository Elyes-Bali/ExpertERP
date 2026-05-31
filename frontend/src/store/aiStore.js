import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/ai"
    : "/api/ai";

export const useAIStore = create((set) => ({
  insights: "",
  loading: false,

  generateInsights: async () => {
    try {
      set({ loading: true });

      const res = await axios.get(`${API}/business-insights`);

      set({
        insights: res.data.insights,
      });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },
}));