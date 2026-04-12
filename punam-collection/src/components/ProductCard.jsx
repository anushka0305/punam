import { Heart, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { user } = useAuth()
  const { addToCart, toggleWishlist, isInWishlist } = useCart()
  const navigate = useNavigate()
  const inWishlist = isInWishlist(product.id)
  const discountedPrice = product.price - (product.price * (product.discount || 0) / 100)

  async function handleCart(e) {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    await addToCart(product.id)
  }

  async function handleWishlist(e) {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    await toggleWishlist(product.id)
  }

  return (
    <div className="product-card bg-white cursor-pointer group" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="relative overflow-hidden aspect-[3/4]">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-cream/60 heritage-pattern flex items-center justify-center">
            <span className="font-serif text-4xl text-gold/30">✦</span>
          </div>
        )}
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 badge-discount">{product.discount}% OFF</span>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-heritage/50 flex items-center justify-center">
            <span className="font-sans text-white text-sm tracking-widest uppercase">Sold Out</span>
          </div>
        )}
        <button onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${inWishlist ? 'bg-maroon text-white' : 'bg-white text-heritage hover:bg-maroon hover:text-white'}`}>
          <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>
        {product.in_stock && (
          <button onClick={handleCart}
            className="absolute bottom-0 left-0 right-0 btn-primary py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2 text-xs">
            <ShoppingBag size={14} /> Add to Cart
          </button>
        )}
      </div>
      <div className="p-4">
        <p className="font-sans text-xs text-maroon/70 uppercase tracking-widest mb-1">{product.type}</p>
        <h3 className="font-serif text-lg text-heritage leading-tight mb-2">{product.name}</h3>
        <div className="flex items-center gap-3">
          <span className="font-sans font-medium text-heritage">₹{discountedPrice.toLocaleString('en-IN')}</span>
          {product.discount > 0 && (
            <span className="font-sans text-sm text-heritage/40 line-through">₹{product.price.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>
    </div>
  )
}
