import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

const SAREE_TYPES = [
  'Pure South Cotton', 'Semi South Silk', 'Pure Silk Handloom',
  'Chanderi Silk', 'Kanchipuram Silk', 'Pochampally Pure Silk',
  'Maheshwari', 'Ikkat Cotton', 'Banarasi Silk', 'Mysore Silk'
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState(typeParam || 'All Sarees')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const isSale = searchParams.get('sale') === 'true'
  const typeParam = searchParams.get('type')

  useEffect(() => {
    fetchProducts()
  }, [activeType, sortBy, isSale])

  async function fetchProducts() {
    setLoading(true)
    let query = supabase.from('products').select('*').eq('in_stock', true)
    if (activeType !== 'All Sarees') query = query.eq('type', activeType)
    if (isSale) query = query.gt('discount', 0)
    if (sortBy === 'price_asc') query = query.order('price', { ascending: true })
    else if (sortBy === 'price_desc') query = query.order('price', { ascending: false })
    else query = query.order('created_at', { ascending: false })
    const { data } = await query
    setProducts(data || [])
    setLoading(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-heritage mb-2">
          {isSale ? 'Sale Collection' : 'Shop Sarees'}
        </h1>
        <p className="font-sans text-sm text-heritage/60">
          {isSale ? 'Exclusive discounts on select pieces' : 'Explore our curated collection of authentic Indian sarees'}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="sticky top-24">
            <h3 className="font-sans text-xs tracking-widest uppercase text-heritage/60 mb-3">Saree Type</h3>
            <div className="space-y-1">
              {['All Sarees', ...SAREE_TYPES].map(type => (
                <button key={type} onClick={() => setActiveType(type)}
                  className={`filter-btn w-full ${activeType === type ? 'active' : ''}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="font-sans text-sm text-heritage/60">{products.length} products</p>
            <div className="flex items-center gap-3">
              <button className="md:hidden flex items-center gap-2 text-sm font-sans text-heritage border border-[#D0C4B0] px-3 py-2"
                onClick={() => setShowFilters(true)}>
                <SlidersHorizontal size={14} /> Filters
              </button>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="font-sans text-sm border border-[#D0C4B0] px-3 py-2 text-heritage bg-white outline-none">
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white animate-pulse">
                  <div className="aspect-[3/4] bg-cream/60" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-cream/80 w-1/2 rounded" />
                    <div className="h-4 bg-cream/80 w-3/4 rounded" />
                    <div className="h-3 bg-cream/80 w-1/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-heritage/40 mb-2">No products found</p>
              <p className="font-sans text-sm text-heritage/30">Try a different filter or check back soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilters && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowFilters(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white z-50 p-6 max-h-[70vh] overflow-y-auto rounded-t-2xl">
            <div className="flex justify-between mb-4">
              <h3 className="font-serif text-xl">Filters</h3>
              <button onClick={() => setShowFilters(false)}><X size={20} /></button>
            </div>
            <p className="font-sans text-xs tracking-widest uppercase text-heritage/60 mb-3">Saree Type</p>
            <div className="space-y-1">
              {['All Sarees', ...SAREE_TYPES].map(type => (
                <button key={type} onClick={() => { setActiveType(type); setShowFilters(false) }}
                  className={`filter-btn w-full ${activeType === type ? 'active' : ''}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
