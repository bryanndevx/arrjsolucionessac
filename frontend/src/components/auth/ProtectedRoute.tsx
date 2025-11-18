import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

type Props = {
  children: ReactNode
  requireRole?: 'admin' | 'user'
}

export default function ProtectedRoute({ children, requireRole }: Props) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (requireRole && user.role !== requireRole) return <Navigate to="/" replace />
  return <>{children}</>
}
