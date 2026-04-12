import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
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
      navigate('/')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream heritage-pattern flex items-center justify-center px-4 py-16">
      <div className="bg-white w-full max-w-md p-8 sm:p-10 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-heritage mb-1">Punam's Collection</h1>
          <h2 className="font-serif text-2xl text-heritage/70 mb-1">Welcome Back</h2>
          <p className="font-sans text-sm text-heritage/50">Sign in to continue</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-sans px-4 py-3 mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-sans text-xs tracking-widest uppercase text-heritage/60 block mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="input-field" placeholder="your@email.com" required />
          </div>
          <div>
            <label className="font-sans text-xs tracking-widest uppercase text-heritage/60 block mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="input-field" placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6 space-y-3">
          <p className="font-sans text-sm text-heritage/60">
            Don't have an account?{' '}
            <Link to="/signup" className="text-maroon hover:underline">Create one</Link>
          </p>
          <Link to="/admin" className="font-sans text-xs text-heritage/40 hover:text-maroon block">Admin Login</Link>
        </div>
      </div>
    </div>
  )
}
