export const BASE_URL = {
  URL: "https://localhost:7270" // http://localhost:4746
};

export const AUTH_ROUTES = {
  LOGIN: "/Auth/login",
  REGISTER: "/Auth/register",
};

export const USER_ROUTES = {
  BY_EMAIL: (email: string) => `/Users/by-email?email=${email}`,
  BY_ID: (id: number) => `/Users/${id}`,
};