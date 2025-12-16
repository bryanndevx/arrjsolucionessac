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
  const [items, setItems] = useState<CartItem[]>([])
  
  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          // restore items ensuring product has expected minimal fields
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
          setItems(restored)
        }
      }
    } catch (err) {
      console.warn('Unable to read cart from localStorage', err)
    }
  }, [])

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
      // Si es alquiler, empezar con 1 día por defecto
      const initialQty = product.type === 'rent' ? 1 : qty
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
