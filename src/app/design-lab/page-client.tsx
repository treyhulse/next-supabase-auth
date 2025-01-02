"use client"

import { useState } from "react"
import { Product } from "@/types"
import { ProductDrawer } from "./_components/product-drawer"
import { MediaSelector } from "./_components/media-selector"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function DesignLabClient() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
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
              // ... existing media selector code
            }}
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