import { Component } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'

export class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-2">حدث خطأ غير متوقع</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            نعتذر. يمكنك تحديث الصفحة أو العودة للرئيسية.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary inline-flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> تحديث
            </button>
            <Link to="/" className="btn-secondary">الرئيسية</Link>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
