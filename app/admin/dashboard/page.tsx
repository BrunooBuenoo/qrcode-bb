"use client"

import { useEffect, useState } from "react"
import { getFirestore, collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { app } from "@/firebase/config"

export default function Dashboard() {
  const [codes, setCodes] = useState<any[]>([])

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "Sem data"

    if (typeof dateValue?.toDate === "function") {
      return dateValue.toDate().toLocaleString()
    }

    if (typeof dateValue?.seconds === "number") {
      return new Date(dateValue.seconds * 1000).toLocaleString()
    }

    if (typeof dateValue === "string") {
      return dateValue
    }

    return "Sem data"
  }

  useEffect(() => {
    const loadCodes = async () => {
      const db = getFirestore(app)
      const q = query(collection(db, "codigos"), orderBy("createdAt", "desc"), limit(50))
      const snapshot = await getDocs(q)
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setCodes(items)
    }

    loadCodes()
  }, [])

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">Últimos Códigos Gerados</h1>
      <div className="grid gap-2">
        {codes.length === 0 && <p>Nenhum código encontrado.</p>}
        {codes.map(code => (
          <div key={code.id} className="border p-3 rounded bg-white shadow">
            <p><strong>Código:</strong> {code.codigo ?? code.valor ?? "-"}</p>
            <p className="text-sm"><strong>Tipo:</strong> {code.tipo ?? "-"}</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(code.createdAt ?? code.dataGeracao)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
