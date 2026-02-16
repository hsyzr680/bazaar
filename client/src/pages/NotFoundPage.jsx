import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-display font-bold text-primary-200 dark:text-primary-800 mb-2">404</div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">الصفحة غير موجودة</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        الرابط الذي طلبته غير صحيح أو تم نقله. يمكنك العودة للرئيسية أو تصفح المنتجات.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <Home className="w-5 h-5" /> الرئيسية
        </Link>
        <Link to="/products" className="btn-secondary inline-flex items-center gap-2">
          <Search className="w-5 h-5" /> المنتجات
        </Link>
      </div>
    </div>
  )
}
