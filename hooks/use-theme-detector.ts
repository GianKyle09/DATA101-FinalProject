"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function useThemeDetector() {
  const { theme, systemTheme } = useTheme()
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== "undefined") {
      const currentTheme = theme === "system" ? systemTheme : theme
      setIsDarkTheme(currentTheme === "dark")
    }
  }, [theme, systemTheme])

  return isDarkTheme
}
