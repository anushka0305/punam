import { Link } from 'react-router-dom'
import { Phone } from 'lucide-react'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '917588544136'

export default function Footer() {
  return (
    <footer className="bg-heritage text-cream mt-16">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-serif text-2xl font-semibold mb-3">Punam's<br />Collection</h3>
          <p className="font-sans text-sm text-cream/70 leading-relaxed">
            Authentic Indian heritage woven in silk and cotton.
          </p>
        </div>
        <div>
          <h4 className="font-sans text-xs tracking-widest uppercase text-gold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {[['Shop', '/shop'], ['Sale', '/shop?sale=true'], ['Reviews', '/reviews'], ['My Account', '/account']].map(([label, href]) => (
              <li key={label}><Link to={href} className="font-sans text-sm text-cream/70 hover:text-gold transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-xs tracking-widest uppercase text-gold mb-4">Contact Us</h4>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 font-sans text-sm text-cream/70 hover:text-gold transition-colors">
            <Phone size={14} /> {WHATSAPP.replace('91', '')}
          </a>
          <p className="font-sans text-xs text-cream/50 mt-4">For orders & delivery updates, contact us on WhatsApp</p>
        </div>
      </div>
      <div className="border-t border-cream/10 text-center py-4">
        <p className="font-sans text-xs text-cream/40">© {new Date().getFullYear()} Punam's Collection. All rights reserved.</p>
      </div>
    </footer>
  )
}
