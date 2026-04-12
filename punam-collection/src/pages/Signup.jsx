import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '', address: '', city: '', pincode: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { email, password, ...profileData } = form
      await signUp(email, password, profileData)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, name, type = 'text', placeholder, required = false }) => (
    <div>
      <label className="font-sans text-xs tracking-widest uppercase text-heritage/60 block mb-2">{label}</label>
      <input type={type} value={form[name]} onChange={update(name)}
        className="input-field" placeholder={placeholder} required={required} />
    </div>
  )

  return (
    <div className="min-h-screen bg-cream heritage-pattern flex items-center justify-center px-4 py-16">
      <div className="bg-white w-full max-w-md p-8 sm:p-10 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-heritage mb-1">Create Account</h1>
          <p className="font-sans text-sm text-heritage/50">Join Punam's Collection</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-sans px-4 py-3 mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full Name" name="full_name" placeholder="Your full name" required />
          <Field label="Email" name="email" type="email" placeholder="your@email.com" required />
          <Field label="Password" name="password" type="password" placeholder="Min 6 characters" required />
          <Field label="Phone / WhatsApp" name="phone" placeholder="+91 98765 43210" required />
          <Field label="Address" name="address" placeholder="House no, Street, Area" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" name="city" placeholder="City" />
            <Field label="Pincode" name="pincode" placeholder="400001" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="font-sans text-sm text-heritage/60 text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-maroon hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
