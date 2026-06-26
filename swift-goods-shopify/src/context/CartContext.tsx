'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react'
import type { ReactNode } from 'react'
import type { ShopifyCart } from '@/lib/shopify'
import {
  createCart,
  addToCart as addToCartAPI,
  updateCartLine as updateCartLineAPI,
  removeFromCart as removeFromCartAPI,
  getCart,
} from '@/lib/shopify'

interface CartContextValue {
  cart: ShopifyCart | null
  cartOpen: boolean
  loading: boolean
  addItem: (variantId: string, quantity?: number) => Promise<void>
  updateItem: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  totalQuantity: number
}

const CartContext = createContext<CartContextValue | null>(null)

const CART_ID_KEY = 'sg-cart-id'

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const cartId = localStorage.getItem(CART_ID_KEY)
    if (cartId) {
      getCart(cartId).then((existingCart) => {
        if (existingCart) {
          setCart(existingCart)
        } else {
          localStorage.removeItem(CART_ID_KEY)
        }
      })
    }
  }, [])

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      setLoading(true)
      try {
        let updatedCart: ShopifyCart | null = null
        if (cart?.id) {
          updatedCart = await addToCartAPI(cart.id, variantId, quantity)
        } else {
          updatedCart = await createCart(variantId, quantity)
        }
        if (updatedCart) {
          setCart(updatedCart)
          localStorage.setItem(CART_ID_KEY, updatedCart.id)
          setCartOpen(true)
        }
      } finally {
        setLoading(false)
      }
    },
    [cart]
  )

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart?.id) return
      setLoading(true)
      try {
        const updatedCart = await updateCartLineAPI(cart.id, lineId, quantity)
        if (updatedCart) {
          setCart(updatedCart)
        }
      } finally {
        setLoading(false)
      }
    },
    [cart]
  )

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart?.id) return
      setLoading(true)
      try {
        const updatedCart = await removeFromCartAPI(cart.id, [lineId])
        if (updatedCart) {
          setCart(updatedCart)
        }
      } finally {
        setLoading(false)
      }
    },
    [cart]
  )

  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => setCartOpen(false), [])
  const toggleCart = useCallback(() => setCartOpen((prev) => !prev), [])

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        loading,
        addItem,
        updateItem,
        removeItem,
        openCart,
        closeCart,
        toggleCart,
        totalQuantity: cart?.totalQuantity ?? 0,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
