"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as React from "react"

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps & React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}