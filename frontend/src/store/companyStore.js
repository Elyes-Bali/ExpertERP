import { create } from "zustand";
import axios from "axios";

const COMPANY_API =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/company"
    : "/api/company";

 

axios.defaults.withCredentials = true;

export const useCompanyStore = create((set) => ({
  company: null,
  loading: false,
  error: null,

  fetchCompany: async () => {
    try {
      const res = await axios.get(COMPANY_API, {
        withCredentials: true,
      });
      set({ company: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  saveCompany: async (formData) => {
    set({ loading: true });
    try {
      const res = await axios.post(COMPANY_API, formData, {
        withCredentials: true,
      });

      set({ company: res.data.company, loading: false });
    } catch (err) {
      set({ error: "Error saving company", loading: false });
    }
  },
}));
