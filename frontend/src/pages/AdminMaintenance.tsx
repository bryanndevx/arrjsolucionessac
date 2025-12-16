import { useState, useEffect } from 'react'
import './AdminDashboard.css'

interface MaintenanceRecord {
  id: number
  equipmentName: string
  type: 'preventive' | 'corrective' | 'inspection'
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  scheduledDate: string
  completedDate?: string
  technician?: string
  cost?: number
  notes?: string
}

export default function AdminMaintenance() {
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([
    {
      id: 1,
      equipmentName: 'Excavadora CAT 320D',
      type: 'preventive',
      status: 'pending',
      priority: 'high',
      scheduledDate: '2025-12-18',
      technician: 'Juan Pérez',
      cost: 2500,
      notes: 'Cambio de aceite y revisión de sistemas hidráulicos'
    },
    {
      id: 2,
      equipmentName: 'Grúa Liebherr LTM 1090',
      type: 'corrective',
      status: 'in_progress',
      priority: 'critical',
      scheduledDate: '2025-12-16',
      technician: 'Carlos Mendoza',
      cost: 8500,
      notes: 'Reparación de sistema de frenos'
    },
    {
      id: 3,
      equipmentName: 'Cargador Komatsu WA470',
      type: 'inspection',
      status: 'completed',
      priority: 'medium',
      scheduledDate: '2025-12-10',
      completedDate: '2025-12-10',
      technician: 'Miguel Torres',
      cost: 500,
      notes: 'Inspección mensual completada'
    }
  ])

  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    equipmentName: '',
    type: 'preventive' as const,
    priority: 'medium' as const,
    scheduledDate: '',
    technician: '',
    cost: '',
    notes: ''
  })

  const getStatusColor = (status: string) => {
    const colors = {
      pending: '#f59e0b',
      in_progress: '#3b82f6',
      completed: '#10b981'
    }
    return colors[status as keyof typeof colors] || '#6b7280'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#f97316',
      critical: '#ef4444'
    }
    return colors[priority as keyof typeof colors] || '#6b7280'
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      preventive: 'Preventivo',
      corrective: 'Correctivo',
      inspection: 'Inspección'
    }
    return labels[type as keyof typeof labels] || type
  }

  const filteredRecords = filter === 'all' 
    ? maintenanceRecords 
    : maintenanceRecords.filter(r => r.status === filter)

  const stats = {
    pending: maintenanceRecords.filter(r => r.status === 'pending').length,
    inProgress: maintenanceRecords.filter(r => r.status === 'in_progress').length,
    completed: maintenanceRecords.filter(r => r.status === 'completed').length,
    totalCost: maintenanceRecords.reduce((sum, r) => sum + (r.cost || 0), 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newRecord: MaintenanceRecord = {
      id: maintenanceRecords.length + 1,
      equipmentName: formData.equipmentName,
      type: formData.type,
      status: 'pending',
      priority: formData.priority,
      scheduledDate: formData.scheduledDate,
      technician: formData.technician,
      cost: parseFloat(formData.cost) || 0,
      notes: formData.notes
    }
    setMaintenanceRecords([...maintenanceRecords, newRecord])
    setShowModal(false)
    setFormData({
      equipmentName: '',
      type: 'preventive',
      priority: 'medium',
      scheduledDate: '',
      technician: '',
      cost: '',
      notes: ''
    })
    alert('✅ Mantenimiento programado exitosamente')
  }

  return (
    <div style={{padding: '1.5rem'}}>
      {/* Header con estadísticas */}
      <div style={{marginBottom: '2rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h2 style={{margin: 0}}>Gestión de Mantenimiento</h2>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '0.6rem 1.2rem',
              background: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            + Programar Mantenimiento
          </button>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem'}}>
          <div style={{background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
            <div style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem'}}>Pendientes</div>
            <div style={{fontSize: '1.875rem', fontWeight: 700, color: '#f59e0b'}}>{stats.pending}</div>
          </div>
          <div style={{background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
            <div style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem'}}>En Proceso</div>
            <div style={{fontSize: '1.875rem', fontWeight: 700, color: '#3b82f6'}}>{stats.inProgress}</div>
          </div>
          <div style={{background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
            <div style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem'}}>Completados</div>
            <div style={{fontSize: '1.875rem', fontWeight: 700, color: '#10b981'}}>{stats.completed}</div>
          </div>
          <div style={{background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
            <div style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem'}}>Costo Total</div>
            <div style={{fontSize: '1.875rem', fontWeight: 700, color: '#163a52'}}>
              S/ {stats.totalCost.toLocaleString('es-PE')}
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1.5rem'}}>
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
          Todos ({maintenanceRecords.length})
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
          Pendientes ({stats.pending})
        </button>
        <button 
          onClick={() => setFilter('in_progress')}
          style={{
            padding: '0.5rem 1rem',
            background: filter === 'in_progress' ? '#3b82f6' : '#e5e7eb',
            color: filter === 'in_progress' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          En Proceso ({stats.inProgress})
        </button>
        <button 
          onClick={() => setFilter('completed')}
          style={{
            padding: '0.5rem 1rem',
            background: filter === 'completed' ? '#10b981' : '#e5e7eb',
            color: filter === 'completed' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Completados ({stats.completed})
        </button>
      </div>

      {/* Tabla de mantenimientos */}
      <div style={{background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead style={{background: '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>
            <tr>
              <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600}}>Equipo</th>
              <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600}}>Tipo</th>
              <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600}}>Prioridad</th>
              <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600}}>Estado</th>
              <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600}}>Fecha</th>
              <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600}}>Técnico</th>
              <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600}}>Costo</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map(record => (
              <tr key={record.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                <td style={{padding: '0.75rem', fontSize: '0.875rem', fontWeight: 500}}>{record.equipmentName}</td>
                <td style={{padding: '0.75rem', fontSize: '0.875rem'}}>{getTypeLabel(record.type)}</td>
                <td style={{padding: '0.75rem', fontSize: '0.875rem'}}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    background: `${getPriorityColor(record.priority)}20`,
                    color: getPriorityColor(record.priority)
                  }}>
                    {record.priority.toUpperCase()}
                  </span>
                </td>
                <td style={{padding: '0.75rem', fontSize: '0.875rem'}}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    background: `${getStatusColor(record.status)}20`,
                    color: getStatusColor(record.status)
                  }}>
                    {record.status === 'pending' && 'Pendiente'}
                    {record.status === 'in_progress' && 'En Proceso'}
                    {record.status === 'completed' && 'Completado'}
                  </span>
                </td>
                <td style={{padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280'}}>
                  {new Date(record.scheduledDate).toLocaleDateString('es-PE')}
                </td>
                <td style={{padding: '0.75rem', fontSize: '0.875rem'}}>{record.technician}</td>
                <td style={{padding: '0.75rem', fontSize: '0.875rem', fontWeight: 600}}>
                  S/ {record.cost?.toLocaleString('es-PE') || '0'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para programar mantenimiento */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            width: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{marginTop: 0}}>Programar Mantenimiento</h3>
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                  Equipo *
                </label>
                <input
                  type="text"
                  value={formData.equipmentName}
                  onChange={(e) => setFormData({...formData, equipmentName: e.target.value})}
                  style={{width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
                  required
                />
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                    Tipo *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    style={{width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
                  >
                    <option value="preventive">Preventivo</option>
                    <option value="corrective">Correctivo</option>
                    <option value="inspection">Inspección</option>
                  </select>
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                    Prioridad *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                    style={{width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="critical">Crítica</option>
                  </select>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                    Fecha *
                  </label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                    style={{width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
                    required
                  />
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                    Costo Estimado
                  </label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    placeholder="0.00"
                    style={{width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
                  />
                </div>
              </div>

              <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                  Técnico Asignado
                </label>
                <input
                  type="text"
                  value={formData.technician}
                  onChange={(e) => setFormData({...formData, technician: e.target.value})}
                  style={{width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
                />
              </div>

              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                  Notas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  style={{width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
                />
              </div>

              <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'flex-end'}}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#e5e7eb',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#7c3aed',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Programar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
