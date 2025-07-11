"use client"

import { useEffect, useState } from "react"
import { db } from "@/firebase/config"
import { collection, getDocs, orderBy, limit, query } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/hooks/useAdmin"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import bwipjs from "bwip-js"

type Codigo = {
  id: string
  codigo: string
  tipo: string
  dataGeracao: string
}

export default function UltimosCodigosPage() {
  const [codigos, setCodigos] = useState<Codigo[]>([])
  const { isAdmin, loading } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAdmin === false) {
      router.push("/login")
    }
  }, [isAdmin, loading, router])

  useEffect(() => {
    const fetchCodigos = async () => {
      const q = query(
        collection(db, "codigos"),
        orderBy("dataGeracao", "desc"),
        limit(10)
      )
      const snapshot = await getDocs(q)
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        codigo: doc.data().codigo,
        tipo: doc.data().tipo,
        dataGeracao: doc.data().dataGeracao.toDate().toLocaleString(),
      }))
      setCodigos(lista)
    }

    if (isAdmin) {
      fetchCodigos()
    }
  }, [isAdmin])

  const gerarCanvas = (codigo: string, canvasId: string) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement
    if (!canvas) return
    try {
      bwipjs.toCanvas(canvas, {
        bcid: "code128",
        text: codigo,
        scaleX: 1.2,
        scaleY: 5.5,
        height: 30,
        includetext: false,
        backgroundcolor: "#ffffff",
      })
    } catch (err) {
      console.error("Erro ao gerar código:", err)
    }
  }

  if (loading || isAdmin === false) {
    return <p className="text-center mt-10">Carregando...</p>
  }

  return (
    <div className="min-h-screen p-6 bg-background flex flex-col items-center">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Últimos Códigos Gerados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {codigos.map((item, index) => (
            <div key={item.id} className="p-4 bg-white rounded shadow">
              <p className="font-mono text-sm mb-1">
                <strong>Código:</strong> {item.codigo}
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                {item.dataGeracao}
              </p>
              <canvas
                id={`barcode-${index}`}
                style={{ width: "250px", height: "100px" }}
                ref={() => gerarCanvas(item.codigo, `barcode-${index}`)}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
