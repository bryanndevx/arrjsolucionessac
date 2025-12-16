import './AdminDashboard.css'
import { useAuth } from '../contexts/AuthContext'
import { Link, Outlet, useLocation } from 'react-router-dom'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">ARRJ</div>
          <div className="brand-name">ARRJ Soluciones</div>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>📊 Dashboard</Link>
          <Link to="/admin/inventario" className={isActive('/admin/inventario') ? 'active' : ''}>📦 Inventario</Link>
          <Link to="/admin/orders" className={isActive('/admin/orders') ? 'active' : ''}>📋 Órdenes</Link>
          <Link to="/admin/mantenimiento" className={isActive('/admin/mantenimiento') ? 'active' : ''}>🔧 Mantenimiento</Link>
          <Link to="/admin/reportes" className={isActive('/admin/reportes') ? 'active' : ''}>📈 Reportes</Link>
          <Link to="/admin/configuracion" className={isActive('/admin/configuracion') ? 'active' : ''}>⚙️ Configuración</Link>
        </nav>
        <div className="sidebar-footer">
          <div className="user-pill">{user?.name}</div>
          <button className="btn-ghost" onClick={() => logout()}>Cerrar sesión</button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <h1>{location.pathname === '/admin' ? 'Dashboard' : location.pathname.split('/').slice(-1)[0]}</h1>
          <div className="header-actions">Última actualización: Hoy</div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
