"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { Product, ProductCategory } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { createClient } from '@/utils/supabase/client'

interface ProductDrawerProps {
  onSelect: (product: Product) => void
  selectedProduct: Product | null
}

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'TSHIRT', label: 'T-Shirts' },
  { id: 'HOODIE', label: 'Hoodies' },
  { id: 'LONG_SLEEVE', label: 'Long Sleeves' },
  { id: 'TANK_TOP', label: 'Tank Tops' },
  { id: 'SWEATSHIRT', label: 'Sweatshirts' },
  { id: 'OTHER', label: 'Other' },
]

export function ProductDrawer({ onSelect, selectedProduct }: ProductDrawerProps) {
  const [open, setOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<ProductCategory>(CATEGORIES[0].id)
  const supabase = createClient()

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          tenant (
            id,
            name,
            createdAt,
            updatedAt
          ),
          inventory (
            id,
            quantity,
            productId,
            createdAt,
            updatedAt
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Product[]
    }
  })

  const filteredProducts = products?.filter(
    (product: Product) => product.category === activeCategory
  )

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value as ProductCategory)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          {selectedProduct ? selectedProduct.name : "Select a Product"}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Select a Product</SheetTitle>
        </SheetHeader>
        
        <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="mt-4">
          <TabsList className="grid grid-cols-3 gap-4">
            {CATEGORIES.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIES.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="grid grid-cols-2 gap-4 p-4">
                  {filteredProducts?.map((product: Product) => (
                    <div
                      key={product.id}
                      className={`cursor-pointer rounded-lg border p-2 transition-colors ${
                        selectedProduct?.id === product.id
                          ? "border-primary bg-primary/10"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => {
                        onSelect(product)
                        setOpen(false)
                      }}
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
                        <p className="text-xs text-muted-foreground">
                          {product.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </SheetContent>
    </Sheet>
  )
} 