
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const root = window.document.documentElement;

    // Force le thème clair moderne
    root.classList.remove("dark");
    root.classList.add("light");
    
    // Configuration CSS pour le nouveau design Qwestoria - variables essentielles uniquement
    root.style.setProperty('--background', '248 250 252'); // slate-50
    root.style.setProperty('--foreground', '15 23 42'); // slate-900
    root.style.setProperty('--primary', '37 99 235'); // blue-600
    root.style.setProperty('--primary-foreground', '248 250 252'); // slate-50
  }, []);

  const value = {
    theme: "light" as Theme,
    setTheme: (theme: Theme) => {
      // Garder toujours le thème clair
      localStorage.setItem(storageKey, "light");
      setTheme("light");
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
