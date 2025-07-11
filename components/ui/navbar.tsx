"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/firebase/config"
import { ThemeToggle } from "@/components/theme-toggle"
import { Lock } from "lucide-react"

export function Navbar() {
  const [logado, setLogado] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLogado(!!user)
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <nav className="flex gap-6 items-center bg-background/80 backdrop-blur-md border border-border rounded-full px-6 py-2 shadow-lg text-sm">
        <Link href="/gerador-code128" className="font-medium hover:text-primary transition-colors">Code 128</Link>
        <Link href="/gerador-ean13" className="font-medium hover:text-primary transition-colors">EAN-13</Link>
        <Link href="/" className="font-medium hover:text-primary transition-colors">QR Code</Link>

        <ThemeToggle />

        <Link
          href={logado ? "/ultimos-codigos" : "/login"}
          title={logado ? "Painel de Códigos" : "Login"}
          className="hover:text-primary"
        >
          <Lock size={18} />
        </Link>
      </nav>
    </div>
  )
}
