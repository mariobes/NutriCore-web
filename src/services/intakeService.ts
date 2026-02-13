import { api } from "./api";
import { INTAKE_ROUTES } from "./routes";
import type { Intake } from "@/core/intake";

export const createIntake = (id: number, data: Intake) =>
  api.post<Intake>(INTAKE_ROUTES.BY_ID(id), data);

export const getUserIntakes = (id: number) =>
  api.get<Intake[]>(INTAKE_ROUTES.BY_ID(id));