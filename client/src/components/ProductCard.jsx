import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { formatPrice, getCategoryLabel } from '../lib/formatPrice'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { addToast } = useToast()

  const handleAdd = (e) => {
    e.preventDefault()
    addToCart(product)
    addToast(`تمت إضافة "${product.name}" إلى السلة`, 'success')
  }

  return (
    <Link to={`/products/${product.id}`} className="card group hover:shadow-xl transition-all duration-300">
      <div className="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden relative">
        {product.category && (
          <span className="absolute top-2 right-2 z-10 px-2 py-0.5 text-xs font-medium rounded-full bg-black/50 text-white">
            {getCategoryLabel(product.category)}
          </span>
        )}
        <img
          src={product.image || `https://placehold.co/400x400/f59e0b/white?text=${encodeURIComponent(product.name?.charAt(0) || '?')}`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleAdd}
          className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 bg-primary-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-opacity hover:bg-primary-600"
        >
          <ShoppingCart className="w-4 h-4" />
          أضف للسلة
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-primary-500 font-bold mt-2">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}
