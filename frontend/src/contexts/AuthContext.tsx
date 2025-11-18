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
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

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
    // Simulación de autenticación. Reemplazar por llamada real al backend.
    await new Promise((r) => setTimeout(r, 600))

    // Si el correo contiene 'admin' se considera administrador (solo simulación)
    const isAdmin = /admin|administrator|root/i.test(email)
    const userObj: User = {
      name: isAdmin ? 'Administrador' : email.split('@')[0],
      email,
      role: isAdmin ? 'admin' : 'user',
      token: 'fake-jwt-token'
    }

    setUser(userObj)
    return userObj
  }

  const logout = () => setUser(null)

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
