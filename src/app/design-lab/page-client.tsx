"use client"

import { useState } from "react"
import { Product } from "@/types"
import { ProductDrawer } from "./_components/product-drawer"
import { MediaSelector } from "./_components/media-selector"
import { DesignSelector } from "./_components/design-selector"
import { DesignLayers } from "./_components/design-layers"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Decimal } from "@prisma/client/runtime/library"

const queryClient = new QueryClient()

// Import the ProductFromPrisma type from product-drawer or create it here
type ProductFromPrisma = Omit<Product, 'tenant' | 'inventory' | 'basePrice'> & {
  tenant?: Product['tenant']
  inventory?: Product['inventory']
  basePrice: Decimal
}

export interface DesignLayer {
  id: string
  type: string
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

export interface Design {
  id?: string
  name: string
  productId: string
  userId: string
  layers: DesignLayer[]
  createdAt?: Date
  updatedAt?: Date
}

export default function DesignLabClient() {
  const [selectedProduct, setSelectedProduct] = useState<ProductFromPrisma | null>(null)
  const [currentDesign, setCurrentDesign] = useState<Design | null>(null)
  const [layers, setLayers] = useState<DesignLayer[]>([])

  const handleProductSelect = (product: ProductFromPrisma) => {
    setSelectedProduct(product)
  }

  const handleDesignSelect = async (designId: string) => {
    // Implement design loading logic
  }

  const handleDesignSave = async (design: Design) => {
    // Implement design saving logic
  }

  const handleLayersChange = (newLayers: DesignLayer[]) => {
    setLayers(newLayers)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <div className="w-64 border-r p-4 space-y-4">
          <ProductDrawer 
            onSelect={handleProductSelect}
            selectedProduct={selectedProduct}
          />
          <MediaSelector 
            onSelectMedia={(media) => {
              // Add media as a new layer
              const newLayer: DesignLayer = {
                id: crypto.randomUUID(),
                type: "image",
                src: media.url,
                x: 0,
                y: 0,
                width: 200,
                height: 200,
                rotation: 0,
                zIndex: layers.length,
                visible: true,
                dpi: 300
              }
              setLayers([...layers, newLayer])
            }}
          />
          <DesignSelector
            currentDesign={currentDesign}
            onSelect={handleDesignSelect}
            onSave={handleDesignSave}
          />
          <DesignLayers
            layers={layers}
            onChange={handleLayersChange}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {selectedProduct ? (
            <div>
              {/* Design canvas implementation */}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a product to start designing
            </div>
          )}
        </div>
      </div>
    </QueryClientProvider>
  )
} 