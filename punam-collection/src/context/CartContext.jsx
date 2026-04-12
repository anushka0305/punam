import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const CartContext = createContext({})

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    if (user) { fetchCart(); fetchWishlist() }
    else { setCart([]); setWishlist([]) }
  }, [user])

  async function fetchCart() {
    const { data } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', user.id)
    setCart(data || [])
  }

  async function fetchWishlist() {
    const { data } = await supabase
      .from('wishlist_items')
      .select('*, product:products(*)')
      .eq('user_id', user.id)
    setWishlist(data || [])
  }

  async function addToCart(productId, quantity = 1) {
    if (!user) return false
    const existing = cart.find(i => i.product_id === productId)
    if (existing) {
      await supabase.from('cart_items').update({ quantity: existing.quantity + quantity }).eq('id', existing.id)
    } else {
      await supabase.from('cart_items').insert({ user_id: user.id, product_id: productId, quantity })
    }
    await fetchCart()
    setCartOpen(true)
    return true
  }

  async function removeFromCart(itemId) {
    await supabase.from('cart_items').delete().eq('id', itemId)
    await fetchCart()
  }

  async function updateQuantity(itemId, quantity) {
    if (quantity < 1) { await removeFromCart(itemId); return }
    await supabase.from('cart_items').update({ quantity }).eq('id', itemId)
    await fetchCart()
  }

  async function clearCart() {
    await supabase.from('cart_items').delete().eq('user_id', user.id)
    setCart([])
  }

  async function toggleWishlist(productId) {
    if (!user) return false
    const existing = wishlist.find(i => i.product_id === productId)
    if (existing) {
      await supabase.from('wishlist_items').delete().eq('id', existing.id)
    } else {
      await supabase.from('wishlist_items').insert({ user_id: user.id, product_id: productId })
    }
    await fetchWishlist()
    return true
  }

  const isInWishlist = (productId) => wishlist.some(i => i.product_id === productId)
  const cartTotal = cart.reduce((sum, item) => {
    const price = item.product?.price || 0
    const discount = item.product?.discount || 0
    const finalPrice = price - (price * discount / 100)
    return sum + finalPrice * item.quantity
  }, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      cart, wishlist, cartOpen, setCartOpen,
      addToCart, removeFromCart, updateQuantity, clearCart,
      toggleWishlist, isInWishlist,
      cartTotal, cartCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
