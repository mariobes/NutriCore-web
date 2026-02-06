import { create } from "zustand";
import type { User, UserCreateUpdate, UserTargets } from "@/core/user";
import { getUserById, updateUser, deleteUser, updateDailyWater, getUserTargets, updateUserTargets } from "@/services/userService";

interface UserState {
  user: User | null;
  targets: UserTargets | null;

  setUser: (user: User) => void;
  clearUser: () => void;
  setTargets: (targets: UserTargets) => void;
  clearTargets: () => void;

  fetchUserById: (id: number) => Promise<boolean>;
  updateUser: (id: number, data: UserCreateUpdate) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;

  updateDailyWater: (id: number, dailyWater: number) => Promise<boolean>;
  fetchUserTargets: (id: number) => Promise<boolean>;
  updateUserTargets: (id: number, data: UserTargets) => Promise<boolean>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  targets: null,

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setTargets: (targets) => set({ targets }),
  clearTargets: () => set({ targets: null }),

  fetchUserById: async (id) => {
    try {
      const res = await getUserById(id);
      get().setUser(res.data);
      return true;
    } catch {
      return false;
    }
  },

  updateUser: async (id, data) => {
    try {
      const res = await updateUser(id, data);
      get().setUser(res.data);
      return true;
    } catch {
      return false;
    }
  },

  deleteUser: async (id) => {
    try {
      await deleteUser(id);
      get().clearUser();
      get().clearTargets();
      return true;
    } catch {
      return false;
    }
  },

  updateDailyWater: async (id, dailyWater) => {
    try {
      await updateDailyWater(id, dailyWater);
      get().setTargets({ ...get().targets, dailyWaterTarget: dailyWater } as UserTargets);		
      return true;
    } catch {
      return false;
    }
  },

  fetchUserTargets: async (id) => {
    try {
      const res = await getUserTargets(id);
      get().setTargets(res.data);
      return true;
    } catch {
      return false;
    }
  },

  updateUserTargets: async (id, data) => {
    try {
      await updateUserTargets(id, data);
      get().setTargets(data);
      return true;
    } catch {
      return false;
    }
  }
}));