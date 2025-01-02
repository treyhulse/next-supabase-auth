"use client"

import { useState } from "react"
import { DesignCanvas } from "./_components/design-canvas"
import { ProductSelector } from "./_components/product-selector"
import { MediaSelector } from "./_components/media-selector"
import { DesignSelector } from "./_components/design-selector"
import { DesignLayers } from "./_components/design-layers"
import { Card } from "@/components/ui/card"

export interface Design {
  id?: string
  name: string
  product: {
    id: string
    name: string
    imageUrl: string
  }
  layers: DesignLayer[]
  createdAt?: Date
  updatedAt?: Date
}

export interface DesignLayer {
  id: string
  type: "image"
  src: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
  visible: boolean
  dpi: number
}

export default function DesignLabClient() {
  const [currentDesign, setCurrentDesign] = useState<Design | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const handleSaveDesign = async (design: Design) => {
    // Implement save logic
  }

  const handleLoadDesign = async (designId: string) => {
    // Implement load logic
  }

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-64 border-r p-4 space-y-4">
        <ProductSelector 
          onSelect={setSelectedProduct}
          selectedProduct={selectedProduct}
        />
        <MediaSelector 
          onSelectMedia={(media) => {
            if (currentDesign) {
              setCurrentDesign({
                ...currentDesign,
                layers: [...currentDesign.layers, {
                  id: crypto.randomUUID(),
                  type: "image",
                  src: media.url,
                  x: 0,
                  y: 0,
                  width: 200,
                  height: 200,
                  rotation: 0,
                  zIndex: currentDesign.layers.length,
                  visible: true,
                  dpi: 300
                }]
              })
            }
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4">
          <Card className="h-full">
            <DesignCanvas
              design={currentDesign}
              onChange={setCurrentDesign}
              product={selectedProduct}
            />
          </Card>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-64 border-l p-4 space-y-4">
        <DesignSelector
          currentDesign={currentDesign}
          onSelect={handleLoadDesign}
          onSave={handleSaveDesign}
        />
        <DesignLayers
          layers={currentDesign?.layers || []}
          onChange={(layers) => {
            if (currentDesign) {
              setCurrentDesign({
                ...currentDesign,
                layers
              })
            }
          }}
        />
      </div>
    </div>
  )
} 