import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { signIn, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@punam.com'
      if (email !== adminEmail) {
        setError('Access denied. Admin only.')
        setLoading(false)
        return
      }
      navigate('/admin/dashboard')
    } catch (err) {
      setError('Invalid credentials')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-heritage flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl text-heritage mb-1">Admin Access</h1>
          <p className="font-sans text-xs tracking-widest uppercase text-heritage/40">Punam's Collection</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-sans px-4 py-3 mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-sans text-xs tracking-widest uppercase text-heritage/60 block mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="input-field" required />
          </div>
          <div>
            <label className="font-sans text-xs tracking-widest uppercase text-heritage/60 block mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="input-field" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
