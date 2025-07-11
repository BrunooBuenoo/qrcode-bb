// components/BarcodeGenerator.tsx
'use client'
import React, { useEffect, useRef } from 'react'
import bwipjs from 'bwip-js'

export default function BarcodeGenerator({ code }: { code: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    try {
      if (canvasRef.current) {
        bwipjs.toCanvas(canvasRef.current, {
          bcid: 'ean13',
          text: code,
          scale: 3,
          height: 10,
          includetext: true,
          textxalign: 'center',
        })
      }
    } catch (e) {
      console.error('Erro ao gerar código de barras', e)
    }
  }, [code])

  return <canvas ref={canvasRef} />
}
