export default function LoadingSpinner({ size = 'md' }) {
  const s = size === 'sm' ? 'w-5 h-5 border-2' : size === 'lg' ? 'w-12 h-12 border-4' : 'w-8 h-8 border-2'
  return (
    <div
      className={`${s} border-primary-500 border-t-transparent rounded-full animate-spin`}
      role="status"
      aria-label="جاري التحميل"
    />
  )
}
