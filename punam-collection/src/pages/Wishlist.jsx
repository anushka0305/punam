import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

export default function Wishlist() {
  const { user } = useAuth()
  const { wishlist } = useCart()

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <Heart size={48} className="text-maroon/20 mb-4" />
      <h2 className="font-serif text-3xl text-heritage mb-2">Your Wishlist</h2>
      <p className="font-sans text-sm text-heritage/60 mb-6">Sign in to save your favourite pieces</p>
      <Link to="/login" className="btn-primary">Sign In</Link>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-heritage mb-2">My Wishlist</h1>
        <p className="font-sans text-sm text-heritage/60">{wishlist.length} saved {wishlist.length === 1 ? 'piece' : 'pieces'}</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-24">
          <Heart size={48} className="text-maroon/20 mx-auto mb-4" />
          <p className="font-serif text-2xl text-heritage/40 mb-2">Your wishlist is empty</p>
          <Link to="/shop" className="btn-primary inline-block mt-6">Explore Collection</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map(item => item.product && <ProductCard key={item.id} product={item.product} />)}
        </div>
      )}
    </div>
  )
}
