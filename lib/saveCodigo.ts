import { addDoc, collection, Timestamp } from "firebase/firestore"
import { FirebaseError } from "firebase/app"
import { auth, db } from "@/firebase/config"

type TipoCodigo = "qrcode" | "code128" | "ean13"

export async function saveCodigoGerado(codigo: string, tipo: TipoCodigo) {
  if (!codigo?.trim()) {
    return { saved: false as const, reason: "empty" as const }
  }

  if (!auth.currentUser) {
    return { saved: false as const, reason: "unauthenticated" as const }
  }

  try {
    await addDoc(collection(db, "codigos"), {
      codigo: codigo.trim(),
      tipo,
      createdAt: Timestamp.now(),
    })

    return { saved: true as const }
  } catch (error) {
    if (error instanceof FirebaseError && error.code === "permission-denied") {
      return { saved: false as const, reason: "permission-denied" as const }
    }

    return { saved: false as const, reason: "unknown" as const }
  }
}