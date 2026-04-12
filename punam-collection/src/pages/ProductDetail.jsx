import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart, toggleWishlist, isInWishlist } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    supabase.from('products').select('*').eq('id', id).single()
      .then(({ data }) => { setProduct(data); setLoading(false) })
  }, [id])

  async function handleCart() {
    if (!user) { navigate('/login'); return }
    await addToCart(product.id)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="font-serif text-2xl text-heritage/40">Loading...</div></div>
  if (!product) return <div className="min-h-screen flex items-center justify-center"><div className="font-serif text-2xl text-heritage/40">Product not found</div></div>

  const price = product.price - (product.price * (product.discount || 0) / 100)
  const inWishlist = isInWishlist(product.id)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-sans text-sm text-heritage/60 hover:text-maroon mb-8 transition-colors">
        <ArrowLeft size={14} /> Back
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="relative">
          <div className="aspect-[3/4] overflow-hidden bg-cream heritage-pattern">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-serif text-6xl text-gold/20">✦</span>
              </div>
            )}
          </div>
          {product.discount > 0 && <span className="absolute top-4 left-4 badge-discount">{product.discount}% OFF</span>}
        </div>

        {/* Info */}
        <div className="pt-4">
          <p className="font-sans text-xs tracking-[3px] uppercase text-maroon mb-2">{product.type}</p>
          <h1 className="font-serif text-4xl text-heritage leading-tight mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="font-serif text-3xl text-heritage">₹{price.toLocaleString('en-IN')}</span>
            {product.discount > 0 && (
              <>
                <span className="font-sans text-lg text-heritage/40 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="badge-discount text-sm">{product.discount}% OFF</span>
              </>
            )}
          </div>
          <div className="w-12 h-px bg-gold mb-6" />
          {product.description && (
            <p className="font-sans text-sm text-heritage/70 leading-relaxed mb-8">{product.description}</p>
          )}
          {product.in_stock ? (
            <div className="flex gap-3">
              <button onClick={handleCart} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <ShoppingBag size={16} /> {added ? 'Added!' : 'Add to Cart'}
              </button>
              <button onClick={() => { if(!user){navigate('/login');return} toggleWishlist(product.id) }}
                className={`w-12 h-12 border flex items-center justify-center transition-all ${inWishlist ? 'bg-maroon border-maroon text-white' : 'border-[#D0C4B0] text-heritage hover:border-maroon'}`}>
                <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>
          ) : (
            <div className="btn-outline text-center opacity-50 cursor-not-allowed">Out of Stock</div>
          )}
          <div className="mt-8 p-4 bg-cream border border-[#E5DDD0]">
            <p className="font-sans text-xs text-heritage/60 leading-relaxed">
              🚚 For delivery timeline & shipping info, contact us on WhatsApp<br />
              ✦ Handcrafted with authentic Indian weaving techniques
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
