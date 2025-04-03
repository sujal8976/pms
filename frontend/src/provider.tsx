import { ReactNode } from "react";
import { ThemeProvider } from "./components/ui/theme-provider";
import { BrowserRouter } from "react-router-dom";

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </ThemeProvider>
  );
}
