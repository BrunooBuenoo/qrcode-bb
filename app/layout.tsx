import "@/styles/globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/ui/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Gerador de Qr-Code",
  description: "Gerador de Qr-Code com Url",
  icons: {
    icon: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Navbar />
          <main className="pt-20">{children}</main> {/* espaço para a navbar */}
        </ThemeProvider>
      </body>
    </html>
  )
}
