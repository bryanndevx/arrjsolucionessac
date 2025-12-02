import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Register.css'

export default function Register() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const validate = () => {
    const e: Record<string, string> = {}
    if (!nombre.trim()) e.nombre = 'Ingresa tu nombre completo.'
    if (!email) e.email = 'Ingresa tu correo electrónico.'
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Correo no válido.'
    if (!password) e.password = 'Ingresa una contraseña.'
    else if (password.length < 6) e.password = 'La contraseña debe tener al menos 6 caracteres.'
    if (password !== confirm) e.confirm = 'Las contraseñas no coinciden.'
    // teléfono opcional: validar formato simple
    if (telefono && !/^\+?[0-9\s-]{6,25}$/.test(telefono)) e.telefono = 'Teléfono no válido.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await register(nombre, email, password, telefono)
      // Registro realizado, redirigir a login
      navigate('/login')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No fue posible crear la cuenta. Intenta más tarde.'
      setErrors({ general: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={onSubmit} noValidate>
        <h2>Crear cuenta</h2>

        {errors.general && <div className="error general">{errors.general}</div>}

        <label className="field">
          <span className="label">Nombre completo</span>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre completo" />
          {errors.nombre && <small className="error">{errors.nombre}</small>}
        </label>

        <label className="field">
          <span className="label">Correo electrónico</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" />
          {errors.email && <small className="error">{errors.email}</small>}
        </label>

        <label className="field">
          <span className="label">Teléfono (opcional)</span>
          <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+51 9xx xxx xxx" />
          {errors.telefono && <small className="error">{errors.telefono}</small>}
        </label>

        <label className="field">
          <span className="label">Contraseña</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
          {errors.password && <small className="error">{errors.password}</small>}
        </label>

        <label className="field">
          <span className="label">Confirmar contraseña</span>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repite la contraseña" />
          {errors.confirm && <small className="error">{errors.confirm}</small>}
        </label>

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? '⏳ Creando...' : 'Crear cuenta'}
        </button>

        <div className="auth-footer">
          <span>¿Ya tienes cuenta? <Link to="/login">Ingresa</Link></span>
        </div>
      </form>
    </div>
  )
}
