import { api } from "./api";
import { MEAL_ROUTES } from "./routes";
import type { Meal } from "@/core/meal";

export const createMeal = (id: number, data: Meal) =>
  api.post<Meal>(MEAL_ROUTES.BY_ID(id), data);

export const getUserMeals = (id: number) =>
  api.get<Meal[]>(MEAL_ROUTES.BY_ID(id));

export const searchMeal = (id: number, query: string) =>
  api.get<Meal[]>(MEAL_ROUTES.SEARCH(id, query));