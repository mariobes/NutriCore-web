import { create } from "zustand";
import type { Meal } from "@/core/meal";
import { createMeal, getUserMeals, searchMeal } from "@/services/mealService";

interface MealState {
  meal: Meal | null;
  meals: Meal[] | null;

  setMeal: (meal: Meal) => void;
  clearMeal: () => void;
  setMeals: (meals: Meal[]) => void;
  clearMeals: () => void;

  createMeal: (id: number, data: Meal) => Promise<boolean>;
  fetchUserMeals: (id: number) => Promise<boolean>;
  searchMeal: (id: number, query: string) => Promise<boolean>;
}

export const useMealStore = create<MealState>((set, get) => ({
    meal: null,
    meals: null,

    setMeal: (meal) => set({ meal }),
    clearMeal: () => set({ meal: null }),
    setMeals: (meals) => set({ meals }),
    clearMeals: () => set({ meals: null }),

    createMeal: async (id, data) => {
      try {
        const res = await createMeal(id, data);
        get().setMeal(res.data);
        const currentMeals = get().meals ?? [];
				get().setMeals([...currentMeals, res.data]);
        return true;
      } catch {
        return false;
      }
    },

    fetchUserMeals: async (id) => {
      try {
        const res = await getUserMeals(id);
        get().setMeals(res.data);
        return true;
      } catch {
        return false;
      }
    },

    searchMeal: async (id, query) => {
      try {
        const res = await searchMeal(id, query);
        get().setMeals(res.data);
        return true;
      } catch {
        return false;
      }
    }
}));