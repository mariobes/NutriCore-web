import { api } from "./api";
import { AUTH_ROUTES, USER_ROUTES } from "./routes";
import type { Login, Register } from "@/core/auth";
import type { User } from "@/core/user";

export const login = (data: Login) =>
  api.post<string>(AUTH_ROUTES.LOGIN, data);

export const register = (data: Register) => 
  api.post<User>(AUTH_ROUTES.REGISTER, data);

export const getUserById = (id: number) =>
  api.get<User>(USER_ROUTES.BY_ID(id));

export const getUserByEmail = (email: string) =>
  api.get<User>(USER_ROUTES.BY_EMAIL(email));