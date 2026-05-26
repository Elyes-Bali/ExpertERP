import { create } from "zustand";
import axios from "axios";

const API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/audit-logs"
    : "/api/audit-logs";

axios.defaults.withCredentials = true;

export const useAuditLogStore = create((set) => ({
  logs: [],
  loading: false,

  fetchAuditLogs: async () => {
    set({ loading: true });

    try {
      const res = await axios.get(API);
      set({ logs: res.data, loading: false });
    } catch (err) {
      console.error("Audit logs fetch error:", err);
      set({ loading: false });
    }
  },
}));