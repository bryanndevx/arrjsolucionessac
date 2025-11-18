import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>()
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: { email?: string; password?: string } = {}
    if (!email) e.email = 'Ingresa tu correo electrónico.'
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Correo no válido.'
    if (!password) e.password = 'Ingresa tu contraseña.'
    else if (password.length < 6) e.password = 'La contraseña debe tener al menos 6 caracteres.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      // Llamar al contexto de autenticación (simulado)
      const user = await login(email, password)
      if (user.role === 'admin') navigate('/admin')
      else navigate('/')
    } catch (err) {
      // mostrar error genérico
      setErrors({ password: 'Error en autenticación. Intenta nuevamente.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={onSubmit} noValidate>
        <h2>Iniciar Sesión</h2>

        <label className="field">
          <span className="label">Correo electrónico</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
          />
          {errors?.email && <small className="error">{errors.email}</small>}
        </label>

        <label className="field">
          <span className="label">Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña"
            required
            minLength={6}
          />
          {errors?.password && <small className="error">{errors.password}</small>}
        </label>

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? '⏳ Cargando...' : 'Entrar'}
        </button>

        <div className="auth-footer">
          <span>¿No tienes cuenta? <Link to="/register">Regístrate</Link></span>
        </div>
      </form>
    </div>
  )
}
