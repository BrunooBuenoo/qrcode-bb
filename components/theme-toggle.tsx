"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [localTheme, setLocalTheme] = useState<"light" | "dark">("light")

  // Atualiza o estado local após detectar mudança no tema
  useEffect(() => {
    if (resolvedTheme) {
      setLocalTheme(resolvedTheme as "light" | "dark")
    }
  }, [resolvedTheme])

  const toggleTheme = () => {
    setTheme(localTheme === "light" ? "dark" : "light")
  }

  return (
    <div className="flex items-center space-x-2 transition-all duration-1000 ease-in-out">
      <Sun
        className={`h-[1.5rem] w-[1.5rem] transition-all duration-[2000ms] ease-in-out transform
        ${localTheme === "dark" ? "opacity-0 -translate-y-6 rotate-45 scale-75" : "opacity-100 translate-y-0 rotate-0 scale-100"}`}
      />
      <Switch
        checked={localTheme === "dark"}
        onCheckedChange={toggleTheme}
        aria-label="Alternar tema"
        className="transition duration-[2000ms] ease-in-out hover:scale-110"
      />
      <Moon
        className={`h-[1.5rem] w-[1.5rem] transition-all duration-[2000ms] ease-in-out transform
        ${localTheme === "light" ? "opacity-0 translate-y-6 -rotate-45 scale-75" : "opacity-100 translate-y-0 rotate-0 scale-100"}`}
      />
    </div>
  )
}
