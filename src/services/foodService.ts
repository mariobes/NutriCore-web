import { api } from "./api";
import { FOOD_ROUTES } from "./routes";
import type { Food } from "@/core/food";

export const createFood = (id: number, data: Food) =>
  api.post<Food>(FOOD_ROUTES.BY_ID(id), data);

export const getUserFoods = (id: number) =>
  api.get<Food[]>(FOOD_ROUTES.BY_ID(id));

export const searchFood = (id: number, query: string) =>
  api.get<Food[]>(FOOD_ROUTES.SEARCH(id, query));