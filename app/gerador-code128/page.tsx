"use client"

import { useRef, useState } from "react"
import bwipjs from "bwip-js"
import jsPDF from "jspdf"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { db } from "@/firebase/config" // 
import { addDoc, collection, Timestamp } from "firebase/firestore"

function calcularDigito13(codigo: string): string {
  if (!/^\d{12}$/.test(codigo)) return codigo
  const soma = [...codigo].reduce((acc, digit, index) => {
    const num = parseInt(digit)
    return acc + num * (index % 2 === 0 ? 1 : 3)
  }, 0)
  const digito = (10 - (soma % 10)) % 10
  return codigo + digito.toString()
}

export default function Code128Generator() {
  const [code, setCode] = useState("")
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const generateBarcode = async (e: React.FormEvent) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = 320
    canvas.height = 180
    const ctx = canvas.getContext("2d")
    if (ctx) {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

        const codigoFinal =
            code.length === 12 && /^\d{12}$/.test(code)
            ? calcularDigito13(code)
            : code

        try {
            bwipjs.toCanvas(canvas, {
            bcid: "code128",
            text: codigoFinal,
            scaleX: 1.2,
            scaleY: 5.5,
            height: 30,
            includetext: false,
            backgroundcolor: "#FFFFFF",
            })

            await addDoc(collection(db, "codigos"), {
            codigo: codigoFinal,
            tipo: "code128",
            dataGeracao: Timestamp.now(),
            })
        } catch (err) {
            console.error("Erro ao gerar código de barras:", err)
        }
    }

  const downloadPDF = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const imgData = canvas.toDataURL("image/png")

    const codigoFinal =
      code.length === 12 && /^\d{12}$/.test(code)
        ? calcularDigito13(code)
        : code

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    })

    const barcodeX = 100
    const barcodeY = 200
    const barcodeW = 250
    const barcodeH = 100

    pdf.text("Código de Barras Code 128", barcodeX, 60)
    pdf.addImage(imgData, "PNG", barcodeX, barcodeY, barcodeW, barcodeH)

    pdf.setFontSize(14)
    pdf.text(codigoFinal, barcodeX + barcodeW / 2, barcodeY + barcodeH + 20, {
      align: "center",
    })

    pdf.save("codigo-code128.pdf")
  }

  const downloadPNG = () => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.href = canvasRef.current.toDataURL("image/png")
    link.download = "codigo-code128.png"
    link.click()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Gerador de Código de Barras Code 128
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={generateBarcode} className="space-y-4">
            <div>
              <Label htmlFor="code">Texto ou Código</Label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Digite o código (12 dígitos calcula o 13º)"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Gerar Código de Barras
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
          {code && (
            <>
              <div className="bg-white p-4 rounded">
                <canvas
                  ref={canvasRef}
                  style={{ width: "250px", height: "100px" }}
                />
              </div>
              <span className="text-sm font-mono tracking-widest">{calcularDigito13(code)}</span>
              <div className="flex gap-4 flex-wrap justify-center">
                <Button onClick={downloadPNG}>Download em PNG</Button>
                <Button onClick={downloadPDF} variant="secondary">
                  Download em PDF
                </Button>
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
