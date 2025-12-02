import React, { createContext, useContext, useEffect, useState } from 'react'

type User = {
  name: string
  email: string
  role: 'admin' | 'user'
  token?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<User>
  register: (name: string, email: string, password: string, phone?: string) => Promise<any>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000/api'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('app_user')
      if (raw) setUser(JSON.parse(raw))
    } catch (e) {
      // noop
    }
  }, [])

  useEffect(() => {
    if (user) localStorage.setItem('app_user', JSON.stringify(user))
    else localStorage.removeItem('app_user')
  }, [user])

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Error en autenticación' }))
      throw new Error(err.message || 'Error en autenticación')
    }

    const data = await res.json()
    const logged: User = { name: data.user.name, email: data.user.email, role: data.user.role, token: data.accessToken }
    setUser(logged)
    localStorage.setItem('app_token', data.accessToken)
    return logged
  }

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone })
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Error al registrar' }))
      throw new Error(err.message || 'Error al registrar')
    }
    return res.json()
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('app_token')
    localStorage.removeItem('app_user')
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
