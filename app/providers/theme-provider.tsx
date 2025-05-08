"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Kendi ThemeProviderProps tipimizi tanımlayalım
interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  [key: string]: any;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
} 