"use client"

import { useEffect, useRef, useCallback } from "react"
import { Design, DesignLayer } from "../page-client"
import { Card } from "@/components/ui/card"

declare global {
  interface Window {
    fabric: any;
  }
}

interface FabricImage extends fabric.Image {
  data?: {
    id: string;
    dpi: number;
  }
}

// Dynamic import for fabric.js
let fabric: any
if (typeof window !== "undefined") {
  const fabricModule = require("fabric").fabric
  fabric = fabricModule
}

interface DesignCanvasProps {
  design: Design | null
  onChange: (design: Design) => void
  product: any
}

export function DesignCanvas({ design, onChange, product }: DesignCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<any>(null)

  const updateDesignFromCanvas = useCallback(() => {
    if (!fabricRef.current || !design) return

    const updatedLayers = design.layers.map(layer => {
      const obj = fabricRef.current!.getObjects().find(
        (o: FabricImage) => o.data?.id === layer.id
      ) as FabricImage

      if (!obj) return layer

      const { left, top, angle, scaleX, scaleY } = obj
      return {
        ...layer,
        x: left ?? 0,
        y: top ?? 0,
        width: (obj.width ?? 0) * (scaleX ?? 1),
        height: (obj.height ?? 0) * (scaleY ?? 1),
        rotation: angle ?? 0
      }
    })

    onChange({ ...design, layers: updatedLayers })
  }, [design, onChange])

  useEffect(() => {
    // Guard against server-side rendering and double initialization
    if (!fabric || !canvasRef.current || fabricRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff"
    })
    fabricRef.current = canvas

    canvas.on('object:modified', () => {
      updateDesignFromCanvas()
    })

    return () => {
      fabricRef.current?.dispose()
      fabricRef.current = null
    }
  }, [updateDesignFromCanvas])

  useEffect(() => {
    if (!fabricRef.current) return

    // Clear existing canvas
    fabricRef.current.clear()
    fabricRef.current.backgroundColor = "#ffffff"
    
    if (!product) {
      // Add placeholder text when no product is selected
      const text = new fabric.Text('Select a product to begin', {
        left: 400,
        top: 300,
        originX: 'center',
        originY: 'center',
        fontFamily: 'sans-serif',
        fontSize: 20,
        fill: '#666666'
      })
      fabricRef.current.add(text)
      fabricRef.current.renderAll()
      return
    }

    // Load product image as background
    fabric.Image.fromURL(product.imageUrl, (img: FabricImage) => {
      // Calculate scaling to fit the canvas while maintaining aspect ratio
      const canvasAspect = fabricRef.current.width! / fabricRef.current.height!
      const imgAspect = img.width! / img.height!
      
      if (imgAspect > canvasAspect) {
        // Image is wider than canvas
        img.scaleToWidth(fabricRef.current.width!)
        // Center vertically
        img.top = (fabricRef.current.height! - (img.height! * img.scaleY!)) / 2
      } else {
        // Image is taller than canvas
        img.scaleToHeight(fabricRef.current.height!)
        // Center horizontally
        img.left = (fabricRef.current.width! - (img.width! * img.scaleX!)) / 2
      }

      fabricRef.current.setBackgroundImage(
        img, 
        fabricRef.current.renderAll.bind(fabricRef.current),
        {
          crossOrigin: 'anonymous'
        }
      )
    })
  }, [product])

  useEffect(() => {
    if (!fabricRef.current || !design) return
    
    // Clear existing objects
    fabricRef.current.clear()

    // Re-add product background if exists
    if (product) {
      fabric.Image.fromURL(product.imageUrl, (img: FabricImage) => {
        img.scaleToWidth(fabricRef.current!.width!)
        fabricRef.current!.setBackgroundImage(
          img, 
          fabricRef.current!.renderAll.bind(fabricRef.current)
        )
      })
    }

    // Add design layers
    design.layers.forEach(layer => {
      if (layer.visible) {
        fabric.Image.fromURL(layer.src, (img: FabricImage) => {
          img.set({
            left: layer.x,
            top: layer.y,
            scaleX: layer.width / img.width!,
            scaleY: layer.height / img.height!,
            angle: layer.rotation,
            data: { id: layer.id, dpi: layer.dpi }
          })
          fabricRef.current!.add(img)
          fabricRef.current!.renderAll()
        })
      }
    })
  }, [design, product])

  return (
    <Card className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <canvas ref={canvasRef} />
    </Card>
  )
} 