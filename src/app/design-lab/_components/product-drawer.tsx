"use client"

import { useState, useMemo } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Product, ProductCategory } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { Search, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductDrawerProps {
  onSelect: (product: Product) => void
  selectedProduct: Product | null
}

// Add type for the productsByCategory object
type ProductCategoryMap = {
  [K in ProductCategory]: Product[]
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
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(null)

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        console.log('Fetched products:', data) // Debug log
        return data as Product[]
      } catch (error) {
        console.error('Error fetching products:', error)
        throw error
      }
    }
  })

  const filteredProducts = useMemo(() => {
    if (!products) return []
    
    let filtered = products

    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (activeCategory) {
      filtered = filtered.filter(product => product.category === activeCategory)
    }

    return filtered
  }, [products, searchQuery, activeCategory])

  const productsByCategory = useMemo(() => {
    if (!products) return {} as ProductCategoryMap
    
    return CATEGORIES.reduce((acc, category) => {
      acc[category.id] = products.filter(p => p.category === category.id)
      return acc
    }, {} as ProductCategoryMap)
  }, [products])

  if (isLoading) {
    return (
      <Button variant="outline" className="w-full" disabled>
        Loading products...
      </Button>
    )
  }

  if (error) {
    return (
      <Button variant="outline" className="w-full" disabled>
        Error loading products
      </Button>
    )
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
          <SheetTitle>Select a Product ({filteredProducts.length} products)</SheetTitle>
        </SheetHeader>
        
        <div className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex">
            {/* Categories Sidebar */}
            <ScrollArea className="h-[calc(100vh-200px)] w-1/3 border-r pr-2">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    !activeCategory && "bg-accent"
                  )}
                  onClick={() => setActiveCategory(null)}
                >
                  All Products ({products?.length || 0})
                </Button>
                {CATEGORIES.map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-between",
                      activeCategory === category.id && "bg-accent"
                    )}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.label} ({productsByCategory[category.id]?.length ?? 0})
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </ScrollArea>

            {/* Products Grid */}
            <ScrollArea className="h-[calc(100vh-200px)] w-2/3 pl-4">
              {filteredProducts.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  {searchQuery 
                    ? "No products match your search"
                    : "No products in this category"}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className={cn(
                        "cursor-pointer rounded-lg border p-2 transition-colors",
                        selectedProduct?.id === product.id
                          ? "border-primary bg-primary/10"
                          : "hover:bg-accent"
                      )}
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
              )}
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 