import { api } from "./api";
import { USER_ROUTES } from "./routes";
import type { User, UserCreateUpdate, UserTargets } from "@/core/user";

export const getUserById = (id: number) =>
  api.get<User>(USER_ROUTES.BY_ID(id));

export const updateUser = (id: number, data: UserCreateUpdate ) =>
  api.put<User>(USER_ROUTES.BY_ID(id), data);

export const deleteUser = (id: number) =>
  api.delete<void>(USER_ROUTES.BY_ID(id));

export const updateDailyWater = (id: number, dailyWater: number) =>
  api.put<void>(USER_ROUTES.WATER(id), dailyWater);

export const getUserTargets = (id: number) =>
  api.get<UserTargets>(USER_ROUTES.TARGETS(id));

export const updateUserTargets = (id: number, data: UserTargets) =>
  api.put<void>(USER_ROUTES.TARGETS(id), data);