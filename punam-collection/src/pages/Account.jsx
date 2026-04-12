import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, User, Edit2, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const STATUS_COLORS = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-purple-50 text-purple-700 border-purple-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
}

export default function Account() {
  const { user, profile, updateProfile } = useAuth()
  const [orders, setOrders] = useState([])
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [tab, setTab] = useState('orders')

  useEffect(() => {
    if (user) {
      fetchOrders()
      setForm({
        full_name: profile?.full_name || '',
        phone: profile?.phone || '',
        address: profile?.address || '',
        city: profile?.city || '',
        pincode: profile?.pincode || '',
      })
    }
  }, [user, profile])

  async function fetchOrders() {
    const { data } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setOrders(data || [])
  }

  async function saveProfile() {
    await updateProfile(form)
    setEditing(false)
  }

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h2 className="font-serif text-3xl text-heritage mb-4">Please sign in</h2>
      <Link to="/login" className="btn-primary">Sign In</Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-serif text-4xl text-heritage mb-8">My Account</h1>

      {/* Tabs */}
      <div className="flex gap-0 mb-8 border-b border-[#E5DDD0]">
        {[['orders', 'My Orders', Package], ['profile', 'Profile', User]].map(([key, label, Icon]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-6 py-3 font-sans text-sm tracking-wide transition-all border-b-2 -mb-px ${
              tab === key ? 'border-maroon text-maroon' : 'border-transparent text-heritage/60 hover:text-maroon'
            }`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-20">
              <Package size={48} className="text-maroon/20 mx-auto mb-4" />
              <p className="font-serif text-2xl text-heritage/40 mb-2">No orders yet</p>
              <Link to="/shop" className="btn-primary inline-block mt-4">Start Shopping</Link>
            </div>
          ) : orders.map(order => (
            <div key={order.id} className="bg-white border border-[#E5DDD0] p-6">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                <div>
                  <p className="font-sans text-xs text-heritage/50 mb-1">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="font-sans text-sm text-heritage/60">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-sans text-xs px-3 py-1 border capitalize ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                    {order.status}
                  </span>
                  <span className="font-serif text-lg text-heritage">₹{order.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="space-y-2">
                {(order.items || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.image_url && <img src={item.image_url} alt={item.name} className="w-12 h-14 object-cover flex-shrink-0" />}
                    <div>
                      <p className="font-sans text-sm text-heritage">{item.name}</p>
                      <p className="font-sans text-xs text-heritage/50">{item.type} · Qty: {item.quantity} · ₹{item.price?.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[#E5DDD0]">
                <p className="font-sans text-xs text-heritage/50">
                  For delivery updates, contact us on WhatsApp with Order ID: #{order.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="bg-white border border-[#E5DDD0] p-6 max-w-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl text-heritage">Profile Details</h2>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex items-center gap-2 font-sans text-sm text-maroon hover:underline">
                <Edit2 size={14} /> Edit
              </button>
            ) : (
              <button onClick={saveProfile} className="flex items-center gap-2 font-sans text-sm text-green-700 hover:underline">
                <Check size={14} /> Save
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="font-sans text-xs tracking-widest uppercase text-heritage/50 block mb-1">Email</label>
              <p className="font-sans text-sm text-heritage">{user.email}</p>
            </div>
            {[
              { label: 'Full Name', key: 'full_name' },
              { label: 'Phone / WhatsApp', key: 'phone' },
              { label: 'Address', key: 'address' },
              { label: 'City', key: 'city' },
              { label: 'Pincode', key: 'pincode' },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="font-sans text-xs tracking-widest uppercase text-heritage/50 block mb-1">{label}</label>
                {editing ? (
                  <input value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="input-field" />
                ) : (
                  <p className="font-sans text-sm text-heritage">{profile?.[key] || '—'}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
