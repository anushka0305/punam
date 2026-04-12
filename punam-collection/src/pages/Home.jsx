import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

const SAREE_TYPES = ['Pure South Cotton', 'Kanchipuram Silk', 'Maheshwari', 'Pochampally Pure Silk', 'Chanderi Silk', 'Semi South Silk', 'Pure Silk Handloom', 'Ikkat Cotton', 'Cotton Silk', 'Gadhwal Cotton', 'Pure Tissue Chanderi Silk']

const HERO_IMAGE = 'https://dbhfuzhpdbiamsgfzzop.supabase.co/storage/v1/object/public/product-images/Rajasthani%20mural%20in%20ancient%20temple.png'
const HERITAGE_IMAGE = 'https://dbhfuzhpdbiamsgfzzop.supabase.co/storage/v1/object/public/product-images/_%20(2).jpeg'
const SAREES_CAT = 'https://dbhfuzhpdbiamsgfzzop.supabase.co/storage/v1/object/public/product-images/Price_-%2012300_-__Pure%20handloom%20Kanchipuram%20silk%20sarees___Silk%20mark%20certified_.jpeg'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    supabase.from('products').select('*').eq('featured', true).eq('in_stock', true).limit(4)
      .then(({ data }) => setFeatured(data || []))
    supabase.from('reviews').select('*').limit(3)
      .then(({ data }) => setReviews(data || []))
  }, [])

  const marqueeItems = [...SAREE_TYPES, ...SAREE_TYPES]

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[500px] overflow-hidden">
        <img src={HERO_IMAGE} alt="Heritage Sarees" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            <p className="font-sans text-xs tracking-[4px] uppercase text-gold mb-4 fade-in-up">New Collection 2026</p>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-white leading-tight max-w-2xl fade-in-up-delay">
              Indian Heritage<br />Woven in Silk
            </h1>
            <p className="font-sans text-sm sm:text-base text-white/80 mt-4 mb-8 max-w-md fade-in-up-delay-2">
              Discover the timeless elegance of handcrafted sarees
            </p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-3 fade-in-up-delay-2">
              Explore Collection <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-wrapper font-sans text-xs tracking-[3px] uppercase">
        <div className="marquee-track">
          {marqueeItems.map((t, i) => (
            <span key={i} className="inline-block mx-6">✦ {t}</span>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="font-sans text-xs tracking-[3px] uppercase text-maroon mb-2">Shop by Category</p>
          <h2 className="font-serif text-4xl text-heritage">Our Collection</h2>
          <div className="gold-divider" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="relative overflow-hidden cursor-pointer group aspect-[3/4]" onClick={() => window.location.href='/shop'}>
            <img src={SAREES_CAT} alt="Sarees" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-heritage/30 group-hover:bg-heritage/10 transition-colors" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-serif text-2xl">Sarees</h3>
            </div>
          </div>
          <div className="relative overflow-hidden cursor-pointer group aspect-[3/4] bg-cream heritage-pattern flex items-center justify-center col-span-1">
            <div className="text-center">
              <p className="font-serif text-2xl text-heritage/40">Dresses</p>
              <p className="font-sans text-xs tracking-widest uppercase text-heritage/30 mt-1">Coming Soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-cream/60 heritage-pattern py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="font-sans text-xs tracking-[3px] uppercase text-maroon mb-2">Curated Selection</p>
            <h2 className="font-serif text-4xl text-heritage">Featured Sarees</h2>
            <div className="gold-divider" />
          </div>
          {featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="font-serif text-xl text-heritage/40">Products coming soon</p>
              <p className="font-sans text-sm text-heritage/30 mt-2">Add products from your admin dashboard</p>
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/shop" className="btn-outline inline-flex items-center gap-2">
              View All Sarees <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="overflow-hidden">
            <img src={HERITAGE_IMAGE} alt="Heritage" className="w-full aspect-[4/5] object-cover" />
          </div>
          <div>
            <p className="font-sans text-xs tracking-[3px] uppercase text-maroon mb-3">Our Heritage</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-heritage leading-tight mb-4">
              Weaving Traditions<br />Since Generations
            </h2>
            <div className="gold-divider mx-0 mb-6" />
            <p className="font-sans text-sm text-heritage/70 leading-relaxed mb-6">
              Each saree tells a story of craftsmanship passed down through generations. From the looms of Kanchipuram to the weaves of Maheshwar, we bring you authentic Indian textiles that celebrate our rich heritage.
            </p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
              Shop Collection <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="bg-heritage text-cream py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <p className="font-sans text-xs tracking-[3px] uppercase text-gold mb-2">What Our Customers Say</p>
              <h2 className="font-serif text-4xl">Reviews</h2>
              <div className="gold-divider" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map(r => (
                <div key={r.id} className="border border-cream/10 p-6">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < (r.rating || 5) ? '#C9A028' : 'transparent'} stroke="#C9A028" />)}
                  </div>
                  <p className="font-serif text-base italic text-cream/80 mb-4">"{r.comment}"</p>
                  <p className="font-sans text-sm text-gold">{r.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
