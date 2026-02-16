import { Link } from 'react-router-dom'
import { ShoppingBag, Menu, Moon, Sun } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

export default function Navbar() {
  const { cartCount } = useCart()
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark')
    setDark(!dark)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold bg-gradient-to-l from-primary-500 to-bazaar-gold bg-clip-text text-transparent">
              نور بازار
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">| متجرك المضيء</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">الرئيسية</Link>
            <Link to="/products" className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">المنتجات</Link>
            <Link to="/cart" className="relative flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-xs bg-primary-500 text-white rounded-full">
                {cartCount}
              </span>
            </Link>
            <Link to="/admin" className="text-gray-500 dark:text-gray-400 hover:text-primary-500 text-sm transition-colors">لوحة التحكم</Link>
            <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Link to="/cart" className="relative p-2">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center text-xs bg-primary-500 text-white rounded-full">
                {cartCount}
              </span>
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-3">
            <Link to="/" onClick={() => setMobileOpen(false)}>الرئيسية</Link>
            <Link to="/products" onClick={() => setMobileOpen(false)}>المنتجات</Link>
            <Link to="/admin" onClick={() => setMobileOpen(false)}>لوحة التحكم</Link>
            <button onClick={toggleDark}>تبديل الوضع {dark ? 'الفاتح' : 'الداكن'}</button>
          </div>
        )}
      </div>
    </nav>
  )
}
