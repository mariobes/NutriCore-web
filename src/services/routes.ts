export const API_BASE_URL = "https://localhost:7270"; // http://localhost:4746

export const AUTH_BASE = "/Auth";
export const USER_BASE = "/Users";

export const AUTH_ROUTES = {
  LOGIN: `${AUTH_BASE}/login`,
  REGISTER: `${AUTH_BASE}/register`
};

export const USER_ROUTES = {
  BY_EMAIL: (email: string) => `${USER_BASE}/by-email?email=${email}`,
  BY_ID: (id: number) => `${USER_BASE}/${id}`,
  WATER: (id: number) => `${USER_BASE}/${id}/water`,
  TARGETS: (id: number) => `${USER_BASE}/${id}/targets`
};