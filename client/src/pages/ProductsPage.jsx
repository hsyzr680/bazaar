import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatPrice, getCategoryLabel } from '../lib/formatPrice'
import { Search, Filter, Tag } from 'lucide-react'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [category, setCategory] = useState('')

  useEffect(() => {
    fetch('/api/products/categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    const url = category ? `/api/products?category=${encodeURIComponent(category)}` : '/api/products'
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setProducts([])
        setLoading(false)
      })
  }, [category])

  const filtered = products
    .filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price
      if (sort === 'price-high') return b.price - a.price
      return 0
    })

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-8">جميع المنتجات</h1>

        <div className="flex flex-col gap-4 mb-8">
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="w-5 h-5 text-gray-500" />
              <button
                onClick={() => setCategory('')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!category ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                الكل
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${category === cat ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pr-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="input-field w-auto"
              >
                <option value="newest">الأحدث</option>
                <option value="price-low">السعر: من الأقل</option>
                <option value="price-high">السعر: من الأعلى</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-gray-500">جاري تحميل المنتجات...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">لا توجد منتجات</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
