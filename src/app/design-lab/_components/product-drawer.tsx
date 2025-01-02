"use client"

import { useState, useMemo } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Product, ProductCategory } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { getProducts } from "@/app/(main)/products/actions"
import { Decimal } from "@prisma/client/runtime/library"

// Create a type for the raw product data from Prisma
type ProductFromPrisma = Omit<Product, 'tenant' | 'inventory' | 'basePrice'> & {
  tenant?: Product['tenant']
  inventory?: Product['inventory']
  basePrice: number
}

interface ProductDrawerProps {
  onSelect: (product: ProductFromPrisma) => void
  selectedProduct: ProductFromPrisma | null
}

interface Filters {
  category: ProductCategory | 'ALL'
  minPrice: number
  maxPrice: number
  hasImage: boolean | 'ALL'
}

const PRODUCT_CATEGORIES = {
  TSHIRT: 'TSHIRT',
  HOODIE: 'HOODIE',
  LONG_SLEEVE: 'LONG_SLEEVE',
  TANK_TOP: 'TANK_TOP',
  SWEATSHIRT: 'SWEATSHIRT',
  OTHER: 'OTHER'
} as const

export function ProductDrawer({ onSelect, selectedProduct }: ProductDrawerProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<Filters>({
    category: 'ALL',
    minPrice: 0,
    maxPrice: 1000,
    hasImage: 'ALL',
  })

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const result = await getProducts()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })

  const filteredProducts = useMemo(() => {
    if (!productsData) return []
    
    let filtered = productsData

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter
    if (filters.category !== 'ALL') {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    // Apply price filter
    filtered = filtered.filter(
      product =>
        Number(product.basePrice) >= filters.minPrice &&
        Number(product.basePrice) <= filters.maxPrice
    )

    // Apply image filter
    if (filters.hasImage !== 'ALL') {
      filtered = filtered.filter(
        product => (product.imageUrl !== null) === filters.hasImage
      )
    }

    return filtered
  }, [productsData, searchQuery, filters])

  const productCategories = Object.values(PRODUCT_CATEGORIES)

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
          <SheetTitle>Select a Product</SheetTitle>
        </SheetHeader>
        
        <div className="mt-4 space-y-4">
          {/* Search and Filters */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.category !== 'ALL' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFilters({ ...filters, category: 'ALL' })}
                className="h-7"
              >
                {filters.category.replace('_', ' ')}
                <X className="ml-2 h-3 w-3" />
              </Button>
            )}
            {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFilters({ ...filters, minPrice: 0, maxPrice: 1000 })}
                className="h-7"
              >
                ${filters.minPrice} - ${filters.maxPrice}
                <X className="ml-2 h-3 w-3" />
              </Button>
            )}
          </div>

          <Separator />

          {/* Filter Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={filters.category}
                onValueChange={(value) =>
                  setFilters({ ...filters, category: value as ProductCategory | 'ALL' })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  {productCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Price Range</label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: Number(e.target.value) })
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: Number(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Products Grid */}
          <ScrollArea className="h-[400px]">
            {filteredProducts.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                No products match your criteria
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
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover rounded-md"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center rounded-md">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-bold">
                          ${Number(product.basePrice).toFixed(2)}
                        </p>
                        <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                          {product.category.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
} 