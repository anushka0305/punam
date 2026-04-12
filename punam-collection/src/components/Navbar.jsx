import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Heart, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, signOut, isAdmin } = useAuth()
  const { cartCount, setCartOpen } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-[#E5DDD0] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="font-serif text-xl sm:text-2xl font-semibold text-heritage tracking-wide">
            Punam's<br className="hidden sm:block" /><span className="text-base sm:text-lg font-normal">Collection</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/shop" className="font-sans text-sm tracking-widest uppercase text-heritage hover:text-maroon transition-colors">Shop</Link>
            <Link to="/shop?sale=true" className="font-sans text-sm tracking-widest uppercase text-maroon font-medium">Sale</Link>
            <Link to="/reviews" className="font-sans text-sm tracking-widest uppercase text-heritage hover:text-maroon transition-colors">Reviews</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <Link to="/wishlist" className="hidden sm:block text-heritage hover:text-maroon transition-colors relative">
              <Heart size={20} />
            </Link>

            <button onClick={() => setCartOpen(true)} className="text-heritage hover:text-maroon transition-colors relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-maroon text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-sans">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="text-heritage hover:text-maroon transition-colors">
                  <User size={20} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-8 bg-white border border-[#E5DDD0] shadow-lg w-48 py-2 z-50">
                    <Link to="/account" className="flex items-center gap-2 px-4 py-2 text-sm font-sans hover:bg-cream text-heritage" onClick={() => setDropdownOpen(false)}>
                      <User size={14} /> My Account
                    </Link>
                    {isAdmin && (
                      <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm font-sans hover:bg-cream text-maroon" onClick={() => setDropdownOpen(false)}>
                        <LayoutDashboard size={14} /> Admin Dashboard
                      </Link>
                    )}
                    <button onClick={handleSignOut} className="flex items-center gap-2 w-full px-4 py-2 text-sm font-sans hover:bg-cream text-heritage text-left">
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-heritage hover:text-maroon transition-colors">
                <User size={20} />
              </Link>
            )}

            <button className="md:hidden text-heritage" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#E5DDD0] px-6 py-4 space-y-4">
          <Link to="/shop" className="block font-sans text-sm tracking-widest uppercase text-heritage py-2" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to="/shop?sale=true" className="block font-sans text-sm tracking-widest uppercase text-maroon py-2" onClick={() => setMenuOpen(false)}>Sale</Link>
          <Link to="/wishlist" className="block font-sans text-sm tracking-widest uppercase text-heritage py-2" onClick={() => setMenuOpen(false)}>Wishlist</Link>
          <Link to="/reviews" className="block font-sans text-sm tracking-widest uppercase text-heritage py-2" onClick={() => setMenuOpen(false)}>Reviews</Link>
        </div>
      )}
    </nav>
  )
}
