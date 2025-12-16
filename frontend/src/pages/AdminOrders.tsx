import { useEffect, useState } from 'react'
import './AdminDashboard.css'

interface OrderItem {
  id: number
  productName: string
  quantity: number
  price: number
  productType: string
}

interface Order {
  id: number
  customerName: string
  email: string
  phone: string
  company?: string
  message?: string
  total: number
  status: string
  type: string
  createdAt: string
  items: OrderItem[]
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  const fetchOrders = async () => {
    try {
      const API = (import.meta.env.VITE_API_URL as string) || '/api'
      const res = await fetch(`${API}/orders`)
      const data = await res.json()
      if (data.success) {
        setOrders(data.data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateStatus = async (orderId: number, newStatus: string) => {
    try {
      const API = (import.meta.env.VITE_API_URL as string) || '/api'
      const res = await fetch(`${API}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (res.ok) {
        alert('✅ Estado actualizado correctamente')
        fetchOrders() // Recargar lista
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('❌ Error al actualizar el estado')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#f59e0b',
      quoted: '#3b82f6',
      accepted: '#10b981',
      in_progress: '#8b5cf6',
      completed: '#059669',
      cancelled: '#ef4444'
    }
    return colors[status] || '#6b7280'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      quoted: 'Cotizado',
      accepted: 'Aceptado',
      in_progress: 'En Proceso',
      completed: 'Completado',
      cancelled: 'Cancelado'
    }
    return labels[status] || status
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter)

  if (loading) {
    return <div style={{padding: '2rem', textAlign: 'center'}}>Cargando órdenes...</div>
  }

  return (
    <div style={{padding: '1.5rem'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h2>Gestión de Órdenes</h2>
        <div style={{display: 'flex', gap: '0.5rem'}}>
          <button 
            onClick={() => setFilter('all')}
            style={{
              padding: '0.5rem 1rem',
              background: filter === 'all' ? '#7c3aed' : '#e5e7eb',
              color: filter === 'all' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Todas ({orders.length})
          </button>
          <button 
            onClick={() => setFilter('pending')}
            style={{
              padding: '0.5rem 1rem',
              background: filter === 'pending' ? '#f59e0b' : '#e5e7eb',
              color: filter === 'pending' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Pendientes ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button 
            onClick={() => setFilter('accepted')}
            style={{
              padding: '0.5rem 1rem',
              background: filter === 'accepted' ? '#10b981' : '#e5e7eb',
              color: filter === 'accepted' ? 'white' : '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Aceptadas ({orders.filter(o => o.status === 'accepted').length})
          </button>
        </div>
      </div>

      <div style={{background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead style={{background: '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>
            <tr>
              <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600}}>ID</th>
              <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600}}>Cliente</th>
              <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600}}>Tipo</th>
              <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600}}>Total</th>
              <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600}}>Estado</th>
              <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600}}>Fecha</th>
              <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{padding: '2rem', textAlign: 'center', color: '#6b7280'}}>
                  No hay órdenes {filter !== 'all' && `con estado "${getStatusLabel(filter)}"`}
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                  <td style={{padding: '0.75rem', fontSize: '0.875rem'}}>#{order.id}</td>
                  <td style={{padding: '0.75rem', fontSize: '0.875rem'}}>
                    <div style={{fontWeight: 500}}>{order.customerName}</div>
                    <div style={{fontSize: '0.75rem', color: '#6b7280'}}>{order.email}</div>
                  </td>
                  <td style={{padding: '0.75rem', fontSize: '0.875rem'}}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      background: order.type === 'rental' ? '#dbeafe' : '#dcfce7',
                      color: order.type === 'rental' ? '#1e40af' : '#166534'
                    }}>
                      {order.type === 'rental' ? '🏗️ Alquiler' : '💰 Venta'}
                    </span>
                  </td>
                  <td style={{padding: '0.75rem', fontSize: '0.875rem', fontWeight: 600}}>
                    S/ {order.total.toLocaleString('es-PE', {minimumFractionDigits: 2})}
                  </td>
                  <td style={{padding: '0.75rem', fontSize: '0.875rem'}}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      background: `${getStatusColor(order.status)}20`,
                      color: getStatusColor(order.status)
                    }}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td style={{padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280'}}>
                    {new Date(order.createdAt).toLocaleDateString('es-PE')}
                  </td>
                  <td style={{padding: '0.75rem', fontSize: '0.875rem'}}>
                    <select
                      value={order.status}
                      onChange={(e) => {
                        if (confirm(`¿Cambiar estado a "${getStatusLabel(e.target.value)}"?`)) {
                          updateStatus(order.id, e.target.value)
                        }
                      }}
                      style={{
                        padding: '0.25rem 0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="quoted">Cotizado</option>
                      <option value="accepted">Aceptado</option>
                      <option value="in_progress">En Proceso</option>
                      <option value="completed">Completado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
