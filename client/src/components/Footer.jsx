import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-display text-2xl font-bold text-white mb-3">نور بازار</h3>
            <p className="text-gray-400 max-w-md leading-relaxed">
              متجرك الإلكتروني الموثوق. نقدم منتجات متنوعة بجودة عالية وأسعار منافسة مع توصيل لجميع المحافظات. 
              الدفع عند الاستلام متاح.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded">الرئيسية</Link></li>
              <li><Link to="/products" className="hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded">المنتجات</Link></li>
              <li><Link to="/cart" className="hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded">السلة</Link></li>
              <li><Link to="/login" className="hover:text-primary-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 rounded">تسجيل الدخول</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400 shrink-0" aria-hidden />
                <a href="tel:+9647000000000" className="hover:text-primary-400 transition-colors">+964 7XX XXX XXXX</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400 shrink-0" aria-hidden />
                <a href="mailto:info@noorbazaar.com" className="hover:text-primary-400 transition-colors">info@noorbazaar.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-400 shrink-0" aria-hidden />
                <span>العراق - بغداد</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} نور بازار. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <span>شروط الاستخدام</span>
            <span>سياسة الخصوصية</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
