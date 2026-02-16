import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('noor-bazaar-cart')
        return saved ? JSON.parse(saved) : []
      }
    } catch (e) {}
    return []
  })

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('noor-bazaar-cart', JSON.stringify(cart))
      }
    } catch (e) {}
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id)
      if (existing) {
        return prev.map(p =>
          p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(p => p.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId)
    setCart(prev =>
      prev.map(p => (p.id === productId ? { ...p, quantity } : p))
    )
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0)
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
