import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { formatPrice, getCategoryLabel } from '../../lib/formatPrice'

export default function AdminProducts() {
  const { addToast } = useToast()
  const [products, setProducts] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', price: '', description: '', image: '', category: 'electronics' })

  const load = () => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => setProducts(Array.isArray(d) ? d : []))
  }

  useEffect(load, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = editing ? `/api/products/${editing.id}` : '/api/products'
    const method = editing ? 'PUT' : 'POST'
    const body = { ...form, price: parseFloat(form.price) || 0 }
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    setModalOpen(false)
    setEditing(null)
    setForm({ name: '', price: '', description: '', image: '', category: 'electronics' })
    addToast(editing ? 'تم تحديث المنتج' : 'تم إضافة المنتج', 'success')
    load()
  }

  const handleDelete = async (id) => {
    if (confirm('حذف هذا المنتج؟')) {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      addToast('تم حذف المنتج', 'success')
      load()
    }
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({
      name: p.name || '',
      price: p.price || '',
      description: p.description || '',
      image: p.image || '',
      category: p.category || 'electronics'
    })
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b px-6 py-4 flex justify-between items-center">
        <Link to="/admin" className="font-display text-xl font-bold text-primary-500">نور بازار</Link>
        <Link to="/" className="text-gray-500 hover:text-primary-500">المتجر</Link>
      </nav>

      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
          <button onClick={() => { setEditing(null); setForm({ name: '', price: '', description: '', image: '', category: 'electronics' }); setModalOpen(true) }} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> إضافة منتج
          </button>
        </div>

        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-right p-4">الصورة</th>
                <th className="text-right p-4">الاسم</th>
                <th className="text-right p-4">الفئة</th>
                <th className="text-right p-4">السعر</th>
                <th className="text-right p-4">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-t dark:border-gray-700">
                  <td className="p-4">
                    <img src={p.image || `https://placehold.co/60x60?text=${p.name?.charAt(0)}`} alt="" className="w-12 h-12 rounded object-cover" />
                  </td>
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4 text-sm text-gray-500">{getCategoryLabel(p.category)}</td>
                  <td className="p-4">{formatPrice(p.price)}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-2 text-primary-500 hover:bg-primary-50 rounded"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-12 text-gray-500">لا توجد منتجات</div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
          <div className="card p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{editing ? 'تعديل منتج' : 'إضافة منتج'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">اسم المنتج</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">السعر ($ دولار)</label>
                <input type="number" step="0.01" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الفئة</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                  <option value="electronics">إلكترونيات</option>
                  <option value="clothes">ملابس</option>
                  <option value="perfumes">عطور</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الوصف</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">رابط الصورة</label>
                <input type="url" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="input-field" placeholder="https://..." />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">حفظ</button>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
