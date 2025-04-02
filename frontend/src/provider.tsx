import { ReactNode } from "react";
import { ThemeProvider } from "./components/ui/theme-provider";

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {children}
    </ThemeProvider>
  );
}
