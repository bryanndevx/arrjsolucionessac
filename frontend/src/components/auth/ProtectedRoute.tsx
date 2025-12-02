import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

type Props = {
  children: ReactNode
  requireRole?: 'admin' | 'user'
}

export default function ProtectedRoute({ children, requireRole }: Props) {
  const { user } = useAuth()

  // If user state is not yet populated but a token exists in localStorage,
  // assume authentication is in progress/succeeded to avoid redirect races.
  const token = typeof window !== 'undefined' ? localStorage.getItem('app_token') : null
  if (!user && !token) return <Navigate to="/login" replace />
  if (requireRole && user && user.role !== requireRole) return <Navigate to="/" replace />
  return <>{children}</>
}
