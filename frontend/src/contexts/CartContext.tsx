/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Product } from '../types'

type CartItem = { 
  product: Product
  quantity: number // Para venta: número de unidades, Para alquiler: número de días
}

type CartContextValue = {
  items: CartItem[]
  add: (product: Product, qty?: number) => void
  remove: (productId: string) => void
  updateQuantity: (productId: string, qty: number) => void
  clear: () => void
  totalCount: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('cart')
      if (!raw) return []
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return []
      const restored = parsed.map((it: any) => ({
        product: {
          id: it.product.id,
          name: it.product.name,
          type: it.product.type,
          price: it.product.price,
          pricePerDay: it.product.pricePerDay,
          images: it.product.images
        },
        quantity: it.quantity
      }))
      console.debug('[Cart] init loaded', restored.length, 'items from localStorage')
      return restored
    } catch (err) {
      console.warn('Unable to read cart from localStorage during init', err)
      return []
    }
  })

  useEffect(() => {
    try {
      // persist only minimal product fields to avoid serialization issues
      const toSave = items.map(i => ({ product: { id: i.product.id, name: i.product.name, type: i.product.type, price: i.product.price, pricePerDay: i.product.pricePerDay, images: i.product.images }, quantity: i.quantity }))
      localStorage.setItem('cart', JSON.stringify(toSave))
      console.debug('[Cart] persisted', toSave.length, 'items')
    } catch (err) {
      console.warn('Unable to persist cart to localStorage', err)
    }
  }, [items])

  const add = (product: Product, qty = 1) => {
    setItems((cur) => {
      const found = cur.find((i) => i.product.id === product.id)
      if (found) {
        return cur.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i))
      }
      // Use the provided qty for both sale and rent (for rent qty represents days)
      const initialQty = qty
      return [...cur, { product, quantity: initialQty }]
    })
  }

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) return
    setItems((cur) => cur.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i)))
  }

  const remove = (productId: string) => {
    setItems((cur) => cur.filter((i) => i.product.id !== productId))
  }

  const clear = () => setItems([])

  const totalCount = items.reduce((s, i) => s + i.quantity, 0)

  return <CartContext.Provider value={{ items, add, remove, updateQuantity, clear, totalCount }}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
