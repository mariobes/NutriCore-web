import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const storedTheme = (localStorage.getItem("theme") as Theme) || "light";
document.documentElement.dataset.theme = storedTheme;

export const useThemeStore = create<ThemeState>((set) => ({
  theme: storedTheme,
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    document.documentElement.dataset.theme = theme;
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      document.documentElement.dataset.theme = newTheme;
      return { theme: newTheme };
    }),
}));