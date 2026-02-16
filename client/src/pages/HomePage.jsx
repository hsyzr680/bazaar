import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Truck, Shield, Award } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch('/api/products?limit=8')
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23D4AF37\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-primary-600 dark:text-primary-400 font-medium mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> مرحباً بك في
            </p>
            <h1 className="font-display text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="bg-gradient-to-l from-primary-500 to-bazaar-gold bg-clip-text text-transparent">نور بازار</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              متجرك الإلكتروني المضيء. منتجات متنوعة، أسعار منافسة، وتوصيل سريع.
            </p>
            <Link to="/products" className="inline-flex items-center gap-2 btn-primary text-lg px-8 py-3">
              تصفح المنتجات
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-3">
                <Truck className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="font-semibold text-lg mb-1">توصيل سريع</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">وصول الطلبية لأي مكان</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-3">
                <Shield className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="font-semibold text-lg mb-1">دفع آمن</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">الدفع عند الاستلام متاح</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-3">
                <Award className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="font-semibold text-lg mb-1">جودة مضمونة</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">منتجات أصلية 100%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-display text-3xl font-bold">أحدث المنتجات</h2>
            <Link to="/products" className="text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
              عرض الكل <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-gray-500">جاري تحميل المنتجات...</p>
              </div>
            ) : products.length > 0 ? (
              products.map(p => <ProductCard key={p.id} product={p} />)
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <p>لا توجد منتجات حالياً. <Link to="/products" className="text-primary-500 hover:underline">تصفح المتجر</Link></p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
