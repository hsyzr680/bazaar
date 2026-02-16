import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/formatPrice'

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart()

  if (cartCount === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">سلة التسوق فارغة</h2>
        <p className="text-gray-500 mb-6">أضف منتجات لسلة التسوق</p>
        <Link to="/products" className="btn-primary">تصفح المنتجات</Link>
      </div>
    )
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-8">سلة التسوق</h1>

        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="card flex flex-col sm:flex-row gap-4 p-4">
              <img
                src={item.image || `https://placehold.co/150x150/f59e0b/white?text=${item.name?.charAt(0)}`}
                alt={item.name}
                className="w-full sm:w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-primary-500 font-bold">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="font-bold">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="card p-6 mt-8">
          <div className="flex justify-between items-center text-xl font-bold mb-4">
            <span>المجموع الكلي</span>
            <span className="text-primary-500">{formatPrice(cartTotal)}</span>
          </div>
          <Link to="/checkout" className="btn-primary block text-center py-3">
            إتمام الطلب
          </Link>
        </div>
      </div>
    </div>
  )
}
