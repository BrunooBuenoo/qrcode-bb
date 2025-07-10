"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useRef } from "react"
import jsPDF from "jspdf"


export default function QRCodeGenerator() {
  const [url, setUrl] = useState("https://sua-url.com")
  const [qrCode, setQRCode] = useState("https://sua-url.com")
  const [color, setColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [size, setSize] = useState(200)
  const [errorCorrection, setErrorCorrection] = useState("M")
  const qrRef = useRef<SVGSVGElement | null>(null)

  const generateQRCode = (e: React.FormEvent) => {
    e.preventDefault()
    setQRCode(url)
  }

  const downloadQRCode = () => {
    const svg = qrRef.current
    if (!svg) return

    const serializer = new XMLSerializer()
    const svgData = serializer.serializeToString(svg)

    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")

    const img = new Image()
    img.onload = () => {
      ctx?.drawImage(img, 0, 0)
      const pngUrl = canvas.toDataURL("image/png")

      const link = document.createElement("a")
      link.href = pngUrl
      link.download = "qrcode.png"
      link.click()
    }
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  const downloadPDF = () => {
    const svg = qrRef.current
    if (!svg) return

    const serializer = new XMLSerializer()
    const svgData = serializer.serializeToString(svg)

    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")

    const img = new Image()
    img.onload = () => {
      ctx?.drawImage(img, 0, 0)
      const imgData = canvas.toDataURL("image/png")

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [size + 40, size + 40],
      })

      pdf.text("QR Code Gerado", 20, 30)
      pdf.addImage(imgData, "PNG", 20, 50, size, size)
      pdf.save("qrcode.pdf")
    }
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Gerador de Qr-Code</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={generateQRCode} className="space-y-4">
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="Enter a URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="color">Cor do QR Code</Label>
                <Input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-10"
                />
              </div>
              <div>
                <Label htmlFor="backgroundColor">Cor de fundo</Label>
                <Input
                  id="backgroundColor"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full h-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="size">
                Tamanho: {size}x{size}
              </Label>
              <Slider
                id="size"
                min={100}
                max={400}
                step={10}
                value={[size]}
                onValueChange={(value) => setSize(value[0])}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="errorCorrection">Nível de correção</Label>
              <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                <SelectTrigger id="errorCorrection">
                  <SelectValue placeholder="Select error correction level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Baixo (7%)</SelectItem>
                  <SelectItem value="M">Médio (15%)</SelectItem>
                  <SelectItem value="Q">Quartil (25%)</SelectItem>
                  <SelectItem value="H">Alto (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Gerar QR Code
            </Button>
            
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center gap-4">
          {qrCode && (
            <>
              <QRCodeSVG
                ref={qrRef}
                value={qrCode}
                size={size}
                fgColor={color}
                bgColor={backgroundColor}
                level={errorCorrection}
                includeMargin
              />
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <Button onClick={downloadQRCode}>Download em PNG</Button>
                <Button onClick={downloadPDF} variant="secondary">Download em PDF</Button>
              </div>
            </>
          )}
        </CardFooter>

      </Card>
    </div>
  )
}
