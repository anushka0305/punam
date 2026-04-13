import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit2, Trash2, X, Check, Package, Tag, ShoppingBag, LogOut } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const SAREE_TYPES = [
  'Pure South Cotton', 'Semi South Silk', 'Pure Silk Handloom',
  'Chanderi Silk', 'Kanchipuram Silk', 'Pochampally Pure Silk',
  'Maheshwari', 'Ikkat Cotton', 'Cotton Silk'
]

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const EMPTY_PRODUCT = { name: '', type: SAREE_TYPES[0], price: '', discount: 0, description: '', image_url: '', images: [], in_stock: true, featured: false }

export default function AdminDashboard() {
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [uploading, setUploading] = useState(false)
  const [newCat, setNewCat] = useState('')
  const [customTypes, setCustomTypes] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/admin'); return }
    if (!isAdmin) { navigate('/'); return }
    fetchAll()
  }, [user, isAdmin])

  async function fetchAll() {
    const [p, o, c] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name')
    ])
    setProducts(p.data || [])
    setOrders(o.data || [])
    setCategories(c.data || [])
    const custom = (c.data || []).map(c => c.name)
    setCustomTypes(custom)
  }

  const allTypes = [...new Set([...SAREE_TYPES, ...customTypes])]

  function openAdd() { setForm(EMPTY_PRODUCT); setEditProduct(null); setShowForm(true) }
  function openEdit(p) { setForm({ ...p }); setEditProduct(p.id); setShowForm(true) }

  async function uploadImages(e) {
  const files = Array.from(e.target.files)
  if (!files.length) return
  setUploading(true)
  const urls = []
  for (const file of files) {
    const ext = file.name.split('.').pop()
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('product-images').upload(path, file)
    if (!error) {
      const { data } = supabase.storage.from('product-images').getPublicUrl(path)
      urls.push(data.publicUrl)
    }
  }
  setForm(f => ({ ...f, images: [...(f.images || []), ...urls], image_url: urls[0] || f.image_url }))
  setUploading(false)
}
  async function saveProduct() {
    if (!form.name || !form.price) return alert('Name and price are required')
    setSaving(true)
    const payload = { ...form, price: parseFloat(form.price), discount: parseInt(form.discount) || 0 }
    if (editProduct) {
      await supabase.from('products').update(payload).eq('id', editProduct)
    } else {
      await supabase.from('products').insert(payload)
    }
    await fetchAll()
    setShowForm(false)
    setSaving(false)
  }

  async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(p => p.filter(x => x.id !== id))
  }

  async function addCategory() {
    if (!newCat.trim()) return
    await supabase.from('categories').insert({ name: newCat.trim() })
    setNewCat('')
    fetchAll()
  }

  async function deleteCategory(id) {
    await supabase.from('categories').delete().eq('id', id)
    fetchAll()
  }

  async function updateOrderStatus(id, status) {
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(o => o.map(x => x.id === id ? { ...x, status } : x))
  }

  const stats = {
    products: products.length,
    orders: orders.length,
    revenue: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0),
    pending: orders.filter(o => o.status === 'pending').length
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-heritage text-cream px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl text-gold">Admin Dashboard</h1>
          <p className="font-sans text-xs text-cream/50">Punam's Collection</p>
        </div>
        <button onClick={async () => { await signOut(); navigate('/') }} className="flex items-center gap-2 font-sans text-sm text-cream/60 hover:text-gold">
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Products', value: stats.products, icon: Tag, color: 'text-maroon' },
          { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'text-blue-600' },
          { label: 'Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: Package, color: 'text-green-600' },
          { label: 'Pending', value: stats.pending, icon: Package, color: 'text-yellow-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-[#E5DDD0] p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-sans text-xs text-heritage/50 uppercase tracking-wide">{label}</p>
              <Icon size={16} className={color} />
            </div>
            <p className={`font-serif text-2xl ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-0 border-b border-[#E5DDD0] mb-6">
          {[['products', 'Products', Tag], ['orders', 'Orders', ShoppingBag], ['categories', 'Categories', Package]].map(([key, label, Icon]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-3 font-sans text-sm border-b-2 -mb-px transition-all ${tab === key ? 'border-maroon text-maroon' : 'border-transparent text-heritage/60 hover:text-maroon'}`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* PRODUCTS TAB */}
        {tab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="font-sans text-sm text-heritage/60">{products.length} products</p>
              <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
                <Plus size={14} /> Add Product
              </button>
            </div>
            <div className="bg-white border border-[#E5DDD0] overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5DDD0]">
                    {['Image', 'Name', 'Type', 'Price', 'Discount', 'Stock', 'Featured', 'Actions'].map(h => (
                      <th key={h} className="font-sans text-xs tracking-widest uppercase text-heritage/50 text-left px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b border-[#E5DDD0] hover:bg-cream/30">
                      <td className="px-4 py-3">
                        {p.image_url ? <img src={p.image_url} alt={p.name} className="w-12 h-14 object-cover" /> : <div className="w-12 h-14 bg-cream heritage-pattern" />}
                      </td>
                      <td className="px-4 py-3 font-sans text-sm text-heritage max-w-[160px] truncate">{p.name}</td>
                      <td className="px-4 py-3 font-sans text-xs text-heritage/60">{p.type}</td>
                      <td className="px-4 py-3 font-sans text-sm">₹{Number(p.price).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 font-sans text-sm text-maroon">{p.discount || 0}%</td>
                      <td className="px-4 py-3">
                        <span className={`font-sans text-xs px-2 py-1 ${p.in_stock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {p.in_stock ? 'In Stock' : 'Out'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.featured && <span className="font-sans text-xs px-2 py-1 bg-gold/10 text-gold">Featured</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(p)} className="text-heritage/60 hover:text-maroon"><Edit2 size={14} /></button>
                          <button onClick={() => deleteProduct(p.id)} className="text-heritage/60 hover:text-red-600"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="text-center py-12">
                  <p className="font-serif text-xl text-heritage/30">No products yet</p>
                  <button onClick={openAdd} className="btn-primary mt-4">Add First Product</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <div>
            <p className="font-sans text-sm text-heritage/60 mb-4">{orders.length} total orders</p>
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-20 bg-white border border-[#E5DDD0]">
                  <p className="font-serif text-2xl text-heritage/30">No orders yet</p>
                </div>
              ) : orders.map(order => (
                <div key={order.id} className="bg-white border border-[#E5DDD0] p-5">
                  <div className="flex flex-wrap justify-between gap-3 mb-3">
                    <div>
                      <p className="font-sans text-xs text-heritage/50">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="font-sans text-sm text-heritage">{order.shipping_address?.full_name} · {order.shipping_address?.phone}</p>
                      <p className="font-sans text-xs text-heritage/50">{order.shipping_address?.address}, {order.shipping_address?.city}</p>
                      <p className="font-sans text-xs text-heritage/40 mt-1">{new Date(order.created_at).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-serif text-lg text-heritage">₹{order.total?.toLocaleString('en-IN')}</span>
                      <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)}
                        className="font-sans text-xs border border-[#D0C4B0] px-2 py-1 bg-white text-heritage outline-none capitalize">
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="border-t border-[#E5DDD0] pt-3 space-y-1">
                    {(order.items || []).map((item, i) => (
                      <p key={i} className="font-sans text-xs text-heritage/60">• {item.name} × {item.quantity} — ₹{item.price?.toLocaleString('en-IN')}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {tab === 'categories' && (
          <div className="max-w-lg">
            <div className="bg-white border border-[#E5DDD0] p-6 mb-6">
              <h3 className="font-serif text-xl text-heritage mb-4">Add Custom Saree Type</h3>
              <div className="flex gap-3">
                <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="e.g. Tussar Silk"
                  className="input-field flex-1" onKeyDown={e => e.key === 'Enter' && addCategory()} />
                <button onClick={addCategory} className="btn-primary px-4"><Plus size={16} /></button>
              </div>
            </div>

            <div className="bg-white border border-[#E5DDD0]">
              <div className="p-4 border-b border-[#E5DDD0]">
                <p className="font-sans text-xs tracking-widest uppercase text-heritage/50">Default Types</p>
              </div>
              {SAREE_TYPES.map(t => (
                <div key={t} className="px-4 py-3 border-b border-[#E5DDD0] font-sans text-sm text-heritage/70">{t}</div>
              ))}
              {categories.length > 0 && (
                <>
                  <div className="p-4 border-b border-[#E5DDD0] bg-cream/30">
                    <p className="font-sans text-xs tracking-widest uppercase text-heritage/50">Custom Types</p>
                  </div>
                  {categories.map(c => (
                    <div key={c.id} className="px-4 py-3 border-b border-[#E5DDD0] flex justify-between items-center">
                      <span className="font-sans text-sm text-heritage">{c.name}</span>
                      <button onClick={() => deleteCategory(c.id)} className="text-heritage/40 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowForm(false)} />
          <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white z-50 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[#E5DDD0] sticky top-0 bg-white">
              <h2 className="font-serif text-2xl text-heritage">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowForm(false)} className="text-heritage hover:text-maroon"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
             {/* Image Upload */}
      <div>
        <label className="font-sans text-xs tracking-widests uppercase text-heritage/60 block mb-2">Product Images (up to 5)</label>
        <div className="border-2 border-dashed border-[#D0C4B0] p-4 text-center">
          <label className="cursor-pointer">
            <input type="file" accept="image/*" multiple onChange={uploadImages} className="hidden" />
            <div className="font-sans text-sm text-heritage/50">
              {uploading ? 'Uploading...' : 'Click to upload images'}
            </div>
          </label>
        </div>
        {form.images?.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {form.images.map((url, i) => (
              <div key={i} className="relative">
                <img src={url} alt="" className="w-20 h-24 object-cover" />
                <button onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                  className="absolute top-0 right-0 bg-maroon text-white w-5 h-5 flex items-center justify-center">
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

              {/* Name */}
              <div>
                <label className="font-sans text-xs tracking-widest uppercase text-heritage/60 block mb-2">Product Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="input-field" placeholder="e.g. Kanchipuram Pure Silk - Red Gold" required />
              </div>

              {/* Type */}
              <div>
                <label className="font-sans text-xs tracking-widest uppercase text-heritage/60 block mb-2">Saree Type *</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="input-field">
                    <optgroup label="Sarees">
                      {SAREE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      {customTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </optgroup>
                  <optgroup label="Dresses">
                  <option value="Dresses">Dresses</option>
                  </optgroup>
              </select>
              </div>

              {/* Price & Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-xs tracking-widest uppercase text-heritage/60 block mb-2">Price (₹) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className="input-field" placeholder="2500" min="0" required />
                </div>
                <div>
                  <label className="font-sans text-xs tracking-widest uppercase text-heritage/60 block mb-2">Discount (%)</label>
                  <input type="number" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: e.target.value }))}
                    className="input-field" placeholder="0" min="0" max="90" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-sans text-xs tracking-widest uppercase text-heritage/60 block mb-2">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="input-field h-24 resize-none" placeholder="Describe the saree, its weave, occasion..." />
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.in_stock} onChange={e => setForm(f => ({ ...f, in_stock: e.target.checked }))} className="w-4 h-4 accent-maroon" />
                  <span className="font-sans text-sm text-heritage">In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-maroon" />
                  <span className="font-sans text-sm text-heritage">Featured on Home</span>
                </label>
              </div>

              <button onClick={saveProduct} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                <Check size={16} /> {saving ? 'Saving...' : editProduct ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
