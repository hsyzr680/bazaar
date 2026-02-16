import { Link } from 'react-router-dom'
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0 })

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => setStats(s => ({ ...s, products: Array.isArray(d) ? d.length : 0 })))
      .catch(() => setStats(s => ({ ...s, products: 0 })))
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => setStats(s => ({ ...s, orders: Array.isArray(d) ? d.length : 0 })))
      .catch(() => setStats(s => ({ ...s, orders: 0 })))
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="font-display text-xl font-bold text-primary-500">نور بازار</Link>
          <Link to="/" className="text-gray-500 hover:text-primary-500">العودة للمتجر</Link>
        </div>
      </nav>

      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">لوحة التحكم</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">المنتجات</p>
                <p className="text-2xl font-bold">{stats.products}</p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">الطلبات</p>
                <p className="text-2xl font-bold">{stats.orders}</p>
              </div>
            </div>
          </div>
        </div>

        <Link to="/admin/products" className="btn-primary inline-flex items-center gap-2">
          <Package className="w-5 h-5" />
          إدارة المنتجات
        </Link>
      </div>
    </div>
  )
}
