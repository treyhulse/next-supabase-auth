'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getProducts } from './actions'
import { Product, ProductCategory } from '@/types'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Decimal } from '@prisma/client/runtime/library'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

// Create the enum values
const PRODUCT_CATEGORIES = {
  TSHIRT: 'TSHIRT',
  HOODIE: 'HOODIE',
  LONG_SLEEVE: 'LONG_SLEEVE',
  TANK_TOP: 'TANK_TOP',
  SWEATSHIRT: 'SWEATSHIRT',
  OTHER: 'OTHER'
} as const

// Create a type for the raw product data from Prisma
type ProductFromPrisma = Omit<Product, 'tenant' | 'inventory' | 'basePrice'> & {
  tenant?: Product['tenant']
  inventory?: Product['inventory']
  basePrice: number
}

interface Filters {
  category: ProductCategory | 'ALL'
  minPrice: number
  maxPrice: number
  hasImage: boolean | 'ALL'
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductFromPrisma[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductFromPrisma[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    category: 'ALL',
    minPrice: 0,
    maxPrice: 1000,
    hasImage: 'ALL',
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getProducts()
        if (!result.success) {
          throw new Error(result.error)
        }
        setProducts(result.data as ProductFromPrisma[])
        setFilteredProducts(result.data as ProductFromPrisma[])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = [...products]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        product =>
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

    setFilteredProducts(filtered)
  }, [searchQuery, filters, products])

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  const productCategories = Object.values(PRODUCT_CATEGORIES)

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 space-y-4">
        <h1 className="text-2xl font-bold">Products</h1>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
                <SheetDescription>
                  Refine your product search with these filters.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
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

                <Separator />

                <div className="space-y-4">
                  <label className="text-sm font-medium">Price Range</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-sm text-gray-500">Min Price</span>
                      <Input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) =>
                          setFilters({ ...filters, minPrice: Number(e.target.value) })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-gray-500">Max Price</span>
                      <Input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) =>
                          setFilters({ ...filters, maxPrice: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Image Filter</label>
                  <Select
                    value={filters.hasImage.toString()}
                    onValueChange={(value) =>
                      setFilters({
                        ...filters,
                        hasImage: value === 'ALL' ? 'ALL' : value === 'true',
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by image" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Products</SelectItem>
                      <SelectItem value="true">With Image</SelectItem>
                      <SelectItem value="false">Without Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>
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
          {filters.hasImage !== 'ALL' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setFilters({ ...filters, hasImage: 'ALL' })}
              className="h-7"
            >
              {filters.hasImage ? 'With Image' : 'Without Image'}
              <X className="ml-2 h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-sm">
            {product.imageUrl && (
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <p className="text-lg font-bold">
                ${Number(product.basePrice).toFixed(2)}
              </p>
              <span className="text-sm px-2 py-1 bg-gray-100 rounded-full">
                {product.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No products found matching your criteria
        </div>
      )}
    </div>
  )
}
