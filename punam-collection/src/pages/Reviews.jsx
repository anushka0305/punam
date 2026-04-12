import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Reviews() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [form, setForm] = useState({ name: '', comment: '', rating: 5 })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    supabase.from('reviews').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setReviews(data || []))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    await supabase.from('reviews').insert(form)
    setReviews(r => [{ ...form, id: Date.now(), created_at: new Date() }, ...r])
    setSubmitted(true)
    setForm({ name: '', comment: '', rating: 5 })
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl text-heritage mb-2">Customer Reviews</h1>
        <div className="gold-divider" />
      </div>

      {!submitted ? (
        <div className="bg-white border border-[#E5DDD0] p-6 mb-10">
          <h2 className="font-serif text-2xl text-heritage mb-4">Leave a Review</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-sans text-xs tracking-widest uppercase text-heritage/60 block mb-2">Your Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="input-field" placeholder="Your name" required />
            </div>
            <div>
              <label className="font-sans text-xs tracking-widest uppercase text-heritage/60 block mb-2">Rating</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => setForm(f => ({ ...f, rating: s }))}>
                    <Star size={24} fill={s <= form.rating ? '#C9A028' : 'transparent'} stroke="#C9A028" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="font-sans text-xs tracking-widest uppercase text-heritage/60 block mb-2">Review</label>
              <textarea value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                className="input-field h-24 resize-none" placeholder="Share your experience..." required />
            </div>
            <button type="submit" className="btn-primary">Submit Review</button>
          </form>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 mb-10 text-center font-sans text-sm">
          Thank you for your review! 🙏
        </div>
      )}

      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className="bg-white border border-[#E5DDD0] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-maroon/10 rounded-full flex items-center justify-center font-serif text-maroon text-lg">
                {r.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-sans text-sm font-medium text-heritage">{r.name}</p>
                <div className="flex gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < (r.rating || 5) ? '#C9A028' : 'transparent'} stroke="#C9A028" />)}
                </div>
              </div>
              <p className="ml-auto font-sans text-xs text-heritage/40">{new Date(r.created_at).toLocaleDateString('en-IN')}</p>
            </div>
            <p className="font-serif text-base italic text-heritage/70">"{r.comment}"</p>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-center font-serif text-xl text-heritage/30 py-10">Be the first to leave a review!</p>
        )}
      </div>
    </div>
  )
}
