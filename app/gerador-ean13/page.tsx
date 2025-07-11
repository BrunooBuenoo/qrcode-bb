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

export default function EAN13Generator() {
  const [ean, setEan] = useState("")
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const generateBarcode = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.fillStyle = "#ffffff"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        bwipjs.toCanvas(canvas, {
          bcid: "ean13",
          text: ean,
          scale: 3,
          height: 10,
          includetext: true,
          textxalign: "center",
          backgroundcolor: "#FFFFFF",
        })
      }
    } catch (error) {
      console.error("Erro ao gerar código de barras:", error)
    }
  }

  const downloadPNG = () => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.href = canvasRef.current.toDataURL("image/png")
    link.download = "codigo-ean13.png"
    link.click()
  }

  const downloadPDF = () => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const imgData = canvas.toDataURL("image/png")

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [canvas.width + 40, canvas.height + 100],
    })

    pdf.text("Código de Barras EAN-13", 20, 30)
    pdf.addImage(imgData, "PNG", 20, 50, canvas.width, canvas.height)
    pdf.save("codigo-ean13.pdf")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Gerador de Código de Barras EAN-13
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={generateBarcode} className="space-y-4">
            <div>
              <Label htmlFor="ean">Código EAN-13</Label>
              <Input
                id="ean"
                type="text"
                value={ean}
                onChange={(e) => setEan(e.target.value)}
                placeholder="Digite um código EAN-13 (12 ou 13 dígitos)"
                maxLength={13}
                pattern="\d{12,13}"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Gerar Código de Barras
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
          {ean && (
            <>
              <div className="bg-white p-4 rounded">
                <canvas ref={canvasRef} />
              </div>
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
