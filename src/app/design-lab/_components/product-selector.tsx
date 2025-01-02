"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { Product } from "@prisma/client"

interface ProductSelectorProps {
  onSelect: (product: Product) => void
  selectedProduct: Product | null
}

export function ProductSelector({ onSelect, selectedProduct }: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Select Product</h3>
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Select Product</h3>
        <div className="flex items-center justify-center h-[400px] text-destructive">
          {error}
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Select Product</h3>
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className={`cursor-pointer p-2 rounded-lg transition-colors ${
                selectedProduct?.id === product.id
                  ? "bg-primary/10"
                  : "hover:bg-accent"
              }`}
              onClick={() => onSelect(product)}
            >
              <div className="aspect-square relative mb-2">
                {product.imageUrl && (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
              </div>
              <p className="text-sm font-medium">{product.name}</p>
              {product.description && (
                <p className="text-xs text-muted-foreground">{product.description}</p>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
} 