import { create } from "zustand";
import type { Food } from "@/core/food";
import { createFood, getUserFoods, searchFood } from "@/services/foodService";

interface FoodState {
  food: Food | null;
  foods: Food[] | null;

  setFood: (food: Food) => void;
  clearFood: () => void;
  setFoods: (foods: Food[]) => void;
  clearFoods: () => void;

  createFood: (id: number, data: Food) => Promise<boolean>;
  fetchUserFoods: (id: number) => Promise<boolean>;
  searchFood: (id: number, query: string) => Promise<boolean>;
}

export const useFoodStore = create<FoodState>((set, get) => ({
    food: null,
    foods: null,

    setFood: (food) => set({ food }),
    clearFood: () => set({ food: null }),
    setFoods: (foods) => set({ foods }),
    clearFoods: () => set({ foods: null }),

    createFood: async (id, data) => {
			try {
				const res = await createFood(id, data);
				get().setFood(res.data);
				const currentFoods = get().foods ?? [];
				get().setFoods([...currentFoods, res.data]);
				return true;
			} catch {
				return false;
			}
    },

    fetchUserFoods: async (id) => {
			try {
				const res = await getUserFoods(id);
				get().setFoods(res.data);
				return true;
			} catch {
				return false;
			}
    },

    searchFood: async (id, query) => {
      try {
        const res = await searchFood(id, query);
        get().setFoods(res.data);
        return true;
      } catch {
        return false;
      }
    }
}));