import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatPrice, getCategoryLabel } from '../lib/formatPrice'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { addToast } = useToast()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(setProduct)
      .catch(() => setProduct(null))
  }, [id])

  const handleAdd = () => {
    if (!product) return
    addToCart(product, quantity)
    addToast(`تمت إضافة ${quantity} من "${product.name}" إلى السلة`, 'success')
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-500">جاري تحميل المنتج...</p>
      </div>
    )
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <nav aria-label="مسار التنقل" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <li><Link to="/" className="hover:text-primary-500">الرئيسية</Link></li>
            <li><span aria-hidden>/</span></li>
            <li><Link to="/products" className="hover:text-primary-500">المنتجات</Link></li>
            <li><span aria-hidden>/</span></li>
            <li className="text-gray-700 dark:text-gray-300 truncate max-w-[180px]" aria-current="page">{product?.name}</li>
          </ol>
        </nav>
        <Link to="/products" className="text-primary-500 hover:text-primary-600 flex items-center gap-1 mb-6 w-fit">
          <ArrowRight className="w-4 h-4" /> العودة للمنتجات
        </Link>

        <div className="card overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 aspect-square bg-gray-100 dark:bg-gray-700">
            <img
              src={product.image || `https://placehold.co/600x600/f59e0b/white?text=${encodeURIComponent(product.name?.charAt(0))}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-8 flex flex-col justify-center">
            {product.category && (
              <span className="inline-block px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-2">
                {getCategoryLabel(product.category)}
              </span>
            )}
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-primary-500 mb-4">
              {formatPrice(product.price)}
            </p>
            {product.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-6">{product.description}</p>
            )}

            <div className="flex items-center gap-4 mb-6">
              <label className="text-gray-600 dark:text-gray-400">الكمية:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="input-field w-24 text-center"
              />
            </div>

            <button onClick={handleAdd} className="btn-primary flex items-center justify-center gap-2 py-3 text-lg w-full sm:w-auto">
              <ShoppingCart className="w-5 h-5" />
              أضف للسلة
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
