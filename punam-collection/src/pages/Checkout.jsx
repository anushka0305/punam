import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || ''
const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '917588544136'

export default function Checkout() {
  const { user, profile } = useAuth()
  const { cart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [address, setAddress] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    city: profile?.city || '',
    pincode: profile?.pincode || '',
  })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h2 className="font-serif text-3xl text-heritage mb-4">Please sign in to checkout</h2>
      <Link to="/login" className="btn-primary">Sign In</Link>
    </div>
  )

  if (cart.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h2 className="font-serif text-3xl text-heritage mb-4">Your cart is empty</h2>
      <Link to="/shop" className="btn-primary">Continue Shopping</Link>
    </div>
  )

  const update = (k) => (e) => setAddress(a => ({ ...a, [k]: e.target.value }))

  async function createOrder() {
    setLoading(true)
    try {
      const items = cart.map(i => ({
        product_id: i.product_id,
        name: i.product?.name,
        type: i.product?.type,
        price: i.product?.price - (i.product?.price * (i.product?.discount || 0) / 100),
        quantity: i.quantity,
        image_url: i.product?.image_url
      }))

      if (RAZORPAY_KEY) {
        // Razorpay payment
        const amountPaise = Math.round(cartTotal * 100)
        const options = {
          key: RAZORPAY_KEY,
          amount: amountPaise,
          currency: 'INR',
          name: "Punam's Collection",
          description: `Order for ${items.length} item(s)`,
          handler: async (response) => {
            await saveOrder(items, response.razorpay_payment_id)
          },
          prefill: { name: address.full_name, contact: address.phone, email: user.email },
          theme: { color: '#6B1F2A' },
          modal: { ondismiss: () => setLoading(false) }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        // No payment gateway - COD fallback
        await saveOrder(items, 'COD')
      }
    } catch (err) {
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  async function saveOrder(items, paymentId) {
    const { data: order } = await supabase.from('orders').insert({
      user_id: user.id,
      items,
      total: cartTotal,
      status: 'confirmed',
      payment_id: paymentId,
      shipping_address: address
    }).select().single()

    await clearCart()

    // WhatsApp notification to owner
    const orderText = items.map(i => `• ${i.name} x${i.quantity} – ₹${(i.price * i.quantity).toLocaleString('en-IN')}`).join('\n')
    const msg = encodeURIComponent(
      `🛍️ *New Order Received!*\n\n` +
      `*Customer:* ${address.full_name}\n` +
      `*Phone:* ${address.phone}\n` +
      `*Address:* ${address.address}, ${address.city} - ${address.pincode}\n\n` +
      `*Items:*\n${orderText}\n\n` +
      `*Total: ₹${cartTotal.toLocaleString('en-IN')}*\n` +
      `*Payment ID:* ${paymentId}\n` +
      `*Order ID:* ${order?.id?.slice(0, 8) || 'N/A'}`
    )
    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank')
    navigate('/account')
    setLoading(false)
  }

  const shipping = cartTotal > 1500 ? 0 : 99
  const finalTotal = cartTotal + shipping

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-serif text-4xl text-heritage mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left - Address */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="font-serif text-2xl text-heritage mb-4">Delivery Address</h2>
          {[
            { label: 'Full Name', key: 'full_name', placeholder: 'Your full name' },
            { label: 'Phone / WhatsApp', key: 'phone', placeholder: '+91 98765 43210' },
            { label: 'Address', key: 'address', placeholder: 'House no, Street, Area' },
            { label: 'City', key: 'city', placeholder: 'City' },
            { label: 'Pincode', key: 'pincode', placeholder: '400001' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="font-sans text-xs tracking-widest uppercase text-heritage/60 block mb-2">{label}</label>
              <input type="text" value={address[key]} onChange={update(key)}
                className="input-field" placeholder={placeholder} required />
            </div>
          ))}

          <div className="bg-cream/60 border border-[#E5DDD0] p-4 mt-4">
            <p className="font-sans text-xs text-heritage/60 leading-relaxed">
              📦 After placing your order, you'll be redirected to WhatsApp to notify us.<br />
              🚚 Delivery updates will be sent to your WhatsApp number.
            </p>
          </div>
        </div>

        {/* Right - Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-[#E5DDD0] p-6 sticky top-24">
            <h2 className="font-serif text-xl text-heritage mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cart.map(item => {
                const p = item.product
                if (!p) return null
                const price = p.price - (p.price * (p.discount || 0) / 100)
                return (
                  <div key={item.id} className="flex justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm text-heritage truncate">{p.name}</p>
                      <p className="font-sans text-xs text-heritage/50">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-sans text-sm text-heritage flex-shrink-0">₹{(price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-[#E5DDD0] pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-sans text-sm text-heritage/60">Subtotal</span>
                <span className="font-sans text-sm">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-sm text-heritage/60">Shipping</span>
                <span className="font-sans text-sm">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              {shipping > 0 && <p className="font-sans text-xs text-heritage/40">Free shipping on orders above ₹1,500</p>}
              <div className="flex justify-between border-t border-[#E5DDD0] pt-3 mt-2">
                <span className="font-serif text-lg text-heritage">Total</span>
                <span className="font-serif text-xl text-heritage">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button onClick={createOrder} disabled={loading} className="btn-primary w-full mt-6">
              {loading ? 'Processing...' : RAZORPAY_KEY ? 'Pay Now' : 'Place Order (COD)'}
            </button>
            {!RAZORPAY_KEY && (
              <p className="font-sans text-xs text-heritage/40 text-center mt-2">Cash on Delivery</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
