import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { formatPrice } from '../lib/formatPrice'

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    payment: 'cash'
  })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: cart,
          total: cartTotal
        })
      })
      if (res.ok) {
        clearCart()
        addToast('تم إرسال الطلب بنجاح. سنتواصل معك قريباً.', 'success')
        setDone(true)
      } else {
        addToast('حدث خطأ. حاول مرة أخرى.', 'error')
      }
    } catch (err) {
      console.error(err)
      addToast('حدث خطأ في الاتصال. تحقق من الإنترنت وحاول مرة أخرى.', 'error')
    }
    setSubmitting(false)
  }

  if (cart.length === 0 && !done) {
    navigate('/cart')
    return null
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">تم إرسال الطلب بنجاح!</h1>
        <p className="text-gray-500 mb-6">سنتواصل معك قريباً لتأكيد الطلبية والتوصيل.</p>
        <button onClick={() => navigate('/')} className="btn-primary">العودة للرئيسية</button>
      </div>
    )
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-8">إتمام الطلب</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="input-field"
              placeholder="أدخل اسمك"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="input-field"
              placeholder="07XX XXX XXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">العنوان</label>
            <textarea
              required
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="input-field min-h-[100px]"
              placeholder="المحافظة، المنطقة، الشارع"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">طريقة الدفع</label>
            <select
              value={form.payment}
              onChange={e => setForm({ ...form, payment: e.target.value })}
              className="input-field"
            >
              <option value="cash">الدفع عند الاستلام (كاش)</option>
            </select>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-4">ملخص الطلب ({cart.length} منتجات)</h3>
            <p className="text-2xl font-bold text-primary-500">
              المجموع: {formatPrice(cartTotal)}
            </p>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-lg">
            {submitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
          </button>
        </form>
      </div>
    </div>
  )
}
