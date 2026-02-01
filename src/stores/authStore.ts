import { create } from "zustand";
import { login, register, getUserByEmail } from "@/services/authService";
import type { Login, Register } from "@/core/auth";

interface AuthState {
  token: string;
  role: string;
  userId: string;

  isLoggedIn: () => boolean;
  getToken: () => string;
  getRole: () => string;
  getUserId: () => number;

  setToken: (token: string) => void;
  setRole: (role: string) => void;
  setUserId: (id: string) => void;

  logout: () => void;
  login: (data: Login) => Promise<boolean>;
  register: (data: Register) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem("token") || "",
  role: localStorage.getItem("role") || "",
  userId: localStorage.getItem("userId") || "",

  isLoggedIn: () => !!get().token,
  getToken: () => get().token,
  getRole: () => get().role,
  getUserId: () => Number(get().userId),

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  setRole: (role) => {
    localStorage.setItem("role", role);
    set({ role });
  },

  setUserId: (id) => {
    localStorage.setItem("userId", id);
    set({ userId: id });
  },

  logout: () => {
    localStorage.clear();
    set({ token: "", role: "", userId: "" });
  },

  login: async (data) => {
    try {
      const res = await login(data);
      get().setToken(res.data);

      const user = await getUserByEmail(data.email);
      get().setRole(user.data.role);
      get().setUserId(String(user.data.id));

      return true;
    } catch {
      return false;
    }
  },

  register: async (data) => {
    try {
      await register(data);
      return true;
    } catch {
      return false;
    }
  },
}));