"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="light"
      themes={["light", "dark"]}
      enableSystem={false} // <- substitui o antigo disableSystemTheme
    >
      {children}
    </NextThemesProvider>
  )
}
