import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function CartPanel() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart()
  const { user } = useAuth()

  if (!cartOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setCartOpen(false)} />
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[#E5DDD0]">
          <h2 className="font-serif text-2xl text-heritage">Your Cart</h2>
          <button onClick={() => setCartOpen(false)} className="text-heritage hover:text-maroon">
            <X size={22} />
          </button>
        </div>

        {!user ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag size={48} className="text-maroon/20 mb-4" />
            <p className="font-serif text-xl text-heritage mb-2">Please sign in</p>
            <p className="font-sans text-sm text-heritage/60 mb-6">to view your cart</p>
            <Link to="/login" onClick={() => setCartOpen(false)} className="btn-primary">Sign In</Link>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag size={48} className="text-maroon/20 mb-4" />
            <p className="font-serif text-xl text-heritage mb-2">Your cart is empty</p>
            <Link to="/shop" onClick={() => setCartOpen(false)} className="btn-primary mt-4">Explore Collection</Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.map(item => {
                const p = item.product
                if (!p) return null
                const price = p.price - (p.price * (p.discount || 0) / 100)
                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-cream heritage-pattern">
                      {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm text-heritage leading-tight mb-1">{p.name}</p>
                      <p className="font-sans text-xs text-maroon/60">{p.type}</p>
                      <p className="font-sans text-sm font-medium text-heritage mt-1">₹{price.toLocaleString('en-IN')}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 border border-[#D0C4B0] flex items-center justify-center hover:border-maroon">
                          <Minus size={10} />
                        </button>
                        <span className="font-sans text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 border border-[#D0C4B0] flex items-center justify-center hover:border-maroon">
                          <Plus size={10} />
                        </button>
                        <button onClick={() => removeFromCart(item.id)} className="ml-auto text-xs font-sans text-heritage/40 hover:text-maroon">Remove</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="p-6 border-t border-[#E5DDD0]">
              <div className="flex justify-between mb-4">
                <span className="font-sans text-sm text-heritage/60">Subtotal</span>
                <span className="font-serif text-lg text-heritage">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <Link to="/checkout" onClick={() => setCartOpen(false)} className="btn-primary w-full block text-center">
                Proceed to Checkout
              </Link>
              <Link to="/cart" onClick={() => setCartOpen(false)} className="btn-outline w-full block text-center mt-3">
                View Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}
