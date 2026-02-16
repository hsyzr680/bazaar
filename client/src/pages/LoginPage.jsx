import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email && password) {
      localStorage.setItem('noor-admin', 'true')
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-md">
        <h1 className="font-display text-2xl font-bold text-center mb-6">تسجيل الدخول</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field"
              placeholder="admin@noorbazaar.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3">دخول</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          للدخول للوحة التحكم: أي بريد وكلمة مرور
        </p>
      </div>
    </div>
  )
}
