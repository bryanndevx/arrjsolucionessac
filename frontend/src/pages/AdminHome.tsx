import { useEffect, useState } from 'react'
import './AdminDashboard.css'
import SalesChart from '../components/charts/SalesChart'
import StatusChart from '../components/charts/StatusChart'

interface Stats {
  activeRentals: number
  salesThisMonth: {
    total: number
    count: number
    average: number
  }
  pendingRequests: number
  availableEquipment: number
  totalInventory: number
  equipmentInUse: number
  totalProducts: number
  completedOrdersThisMonth: number
}

export default function AdminHome() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API = (import.meta.env.VITE_API_URL as string) || '/api'
        const res = await fetch(`${API}/orders/stats`)
        const data = await res.json()
        if (data.success) {
          setStats(data.data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return <div style={{padding: '2rem', textAlign: 'center'}}>Cargando estadísticas...</div>
  }

  return (
    <>
      <section className="cards-row">
        <div className="card info">
          <h3>Inventario Total</h3>
          <div className="big">{stats?.totalInventory || 0}</div>
          <div className="muted">
            {stats?.totalProducts || 0} tipos de equipos · {stats?.availableEquipment || 0} con stock
          </div>
        </div>
        <div className="card info green">
          <h3>Alquileres Activos</h3>
          <div className="big">{stats?.activeRentals || 0}</div>
          <div className="muted">
            {stats?.equipmentInUse || 0} unidades en uso
          </div>
        </div>
        <div className="card info yellow">
          <h3>Ventas del Mes</h3>
          <div className="big">
            S/ {(stats?.salesThisMonth.total || 0).toLocaleString('es-PE', {minimumFractionDigits: 0})}
          </div>
          <div className="muted">
            {stats?.salesThisMonth.count || 0} ventas · {stats?.completedOrdersThisMonth || 0} completadas
          </div>
        </div>
        <div className="card info red">
          <h3>Solicitudes Pendientes</h3>
          <div className="big">{stats?.pendingRequests || 0}</div>
          <div className="muted">Requieren atención</div>
        </div>
      </section>

      <section className="panels-row">
        <div className="panel large">
          <h4>Ingresos Mensuales - Ventas vs Alquileres</h4>
          <div style={{height: '300px', padding: '1rem'}}>
            <SalesChart />
          </div>
        </div>
        <div className="panel small">
          <h4>Estado de Órdenes</h4>
          <div style={{height: '260px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <StatusChart 
              pending={stats?.pendingRequests || 0}
              quoted={0}
              accepted={stats?.activeRentals || 0}
              inProgress={0}
              completed={stats?.completedOrdersThisMonth || 0}
            />
          </div>
        </div>
      </section>

      <section className="panels-row">
        <div className="panel">
          <h4>Resumen Mensual</h4>
          <div className="mini-cards">
            <div className="mini">
              <strong>Total Ventas</strong>
              <div className="num">S/ {((stats?.salesThisMonth.total || 0) / 1000).toFixed(1)}K</div>
            </div>
            <div className="mini">
              <strong>Promedio/Venta</strong>
              <div className="num">S/ {((stats?.salesThisMonth.average || 0) / 1000).toFixed(1)}K</div>
            </div>
            <div className="mini">
              <strong>Órdenes</strong>
              <div className="num">{stats?.completedOrdersThisMonth || 0}</div>
            </div>
            <div className="mini">
              <strong>Equipos Activos</strong>
              <div className="num">{stats?.equipmentInUse || 0}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="panels-row">
        <div className="panel">
          <h4>Equipos Más Rentados</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Categoría</th>
                <th>Rentabilidad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Excavadora CAT 320D</td>
                <td>Excavadoras</td>
                <td>S/ 45,000</td>
                <td><span className="tag active">Disponible</span></td>
              </tr>
              <tr>
                <td>Cargador Komatsu WA470</td>
                <td>Cargadores</td>
                <td>S/ 38,500</td>
                <td><span className="tag active">Disponible</span></td>
              </tr>
              <tr>
                <td>Grúa Liebherr LTM 1090</td>
                <td>Grúas</td>
                <td>S/ 52,000</td>
                <td><span className="tag warning">En Mantenimiento</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
