import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './AdminDashboard.css'

export default function AdminSettings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'business' | 'email' | 'security'>('profile')
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    position: 'Administrador'
  })

  const [businessData, setBusinessData] = useState({
    companyName: 'ARRJ Soluciones S.A.C.',
    ruc: '20123456789',
    address: 'Av. Industrial 123, Lima, Perú',
    phone: '+51 987 654 321',
    email: 'info@arrjsoluciones.com',
    website: 'www.arrjsoluciones.com'
  })

  const [emailConfig, setEmailConfig] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '465',
    smtpUser: 'yamildev22@gmail.com',
    emailDestination: 'yamildev22@gmail.com'
  })

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleProfileSave = () => {
    alert('✅ Perfil actualizado correctamente')
  }

  const handleBusinessSave = () => {
    alert('✅ Información empresarial actualizada')
  }

  const handleEmailSave = () => {
    alert('✅ Configuración de correo actualizada')
  }

  const handleSecuritySave = () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('❌ Las contraseñas no coinciden')
      return
    }
    alert('✅ Contraseña actualizada correctamente')
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  return (
    <div style={{padding: '1.5rem'}}>
      <h2 style={{marginBottom: '1.5rem'}}>Configuración</h2>

      {/* Tabs */}
      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e5e7eb'}}>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            color: activeTab === 'profile' ? '#7c3aed' : '#6b7280',
            border: 'none',
            borderBottom: activeTab === 'profile' ? '2px solid #7c3aed' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'profile' ? 600 : 400,
            marginBottom: '-2px'
          }}
        >
          👤 Perfil
        </button>
        <button
          onClick={() => setActiveTab('business')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            color: activeTab === 'business' ? '#7c3aed' : '#6b7280',
            border: 'none',
            borderBottom: activeTab === 'business' ? '2px solid #7c3aed' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'business' ? 600 : 400,
            marginBottom: '-2px'
          }}
        >
          🏢 Empresa
        </button>
        <button
          onClick={() => setActiveTab('email')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            color: activeTab === 'email' ? '#7c3aed' : '#6b7280',
            border: 'none',
            borderBottom: activeTab === 'email' ? '2px solid #7c3aed' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'email' ? 600 : 400,
            marginBottom: '-2px'
          }}
        >
          📧 Correo
        </button>
        <button
          onClick={() => setActiveTab('security')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            color: activeTab === 'security' ? '#7c3aed' : '#6b7280',
            border: 'none',
            borderBottom: activeTab === 'security' ? '2px solid #7c3aed' : '2px solid transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'security' ? 600 : 400,
            marginBottom: '-2px'
          }}
        >
          🔒 Seguridad
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div style={{background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{marginTop: 0, marginBottom: '1.5rem'}}>Información Personal</h3>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem'}}>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                Nombre Completo
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                style={{width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                style={{width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                Teléfono
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                placeholder="+51 987 654 321"
                style={{width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                Cargo
              </label>
              <input
                type="text"
                value={profileData.position}
                onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                style={{width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
              />
            </div>
          </div>

          <button
            onClick={handleProfileSave}
            style={{
              padding: '0.6rem 1.5rem',
              background: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Guardar Cambios
          </button>
        </div>
      )}

      {/* Business Tab */}
      {activeTab === 'business' && (
        <div style={{background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{marginTop: 0, marginBottom: '1.5rem'}}>Datos de la Empresa</h3>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem'}}>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                Razón Social
              </label>
              <input
                type="text"
                value={businessData.companyName}
                onChange={(e) => setBusinessData({...businessData, companyName: e.target.value})}
                style={{width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                RUC
              </label>
              <input
                type="text"
                value={businessData.ruc}
                onChange={(e) => setBusinessData({...businessData, ruc: e.target.value})}
                style={{width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
              />
            </div>

            <div style={{gridColumn: '1 / -1'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                Dirección
              </label>
              <input
                type="text"
                value={businessData.address}
                onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
                style={{width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                Teléfono
              </label>
              <input
                type="tel"
                value={businessData.phone}
                onChange={(e) => setBusinessData({...businessData, phone: e.target.value})}
                style={{width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                Email Corporativo
              </label>
              <input
                type="email"
                value={businessData.email}
                onChange={(e) => setBusinessData({...businessData, email: e.target.value})}
                style={{width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
              />
            </div>

            <div style={{gridColumn: '1 / -1'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                Sitio Web
              </label>
              <input
                type="text"
                value={businessData.website}
                onChange={(e) => setBusinessData({...businessData, website: e.target.value})}
                style={{width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
              />
            </div>
          </div>

          <button
            onClick={handleBusinessSave}
            style={{
              padding: '0.6rem 1.5rem',
              background: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Guardar Cambios
          </button>
        </div>
      )}

      {/* Email Tab */}
      {activeTab === 'email' && (
        <div style={{background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{marginTop: 0, marginBottom: '1.5rem'}}>Configuración de Correo (SMTP)</h3>
          
          <div style={{padding: '1rem', background: '#dbeafe', borderRadius: '8px', marginBottom: '1.5rem'}}>
            <strong>ℹ️ Información:</strong> Estas configuraciones son para el envío de correos desde el sistema (cotizaciones, notificaciones, etc.)
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem'}}>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                Servidor SMTP
              </label>
              <input
                type="text"
                value={emailConfig.smtpHost}
                onChange={(e) => setEmailConfig({...emailConfig, smtpHost: e.target.value})}
                style={{width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                Puerto
              </label>
              <input
                type="text"
                value={emailConfig.smtpPort}
                onChange={(e) => setEmailConfig({...emailConfig, smtpPort: e.target.value})}
                style={{width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                Usuario SMTP
              </label>
              <input
                type="email"
                value={emailConfig.smtpUser}
                onChange={(e) => setEmailConfig({...emailConfig, smtpUser: e.target.value})}
                style={{width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                Email Destino
              </label>
              <input
                type="email"
                value={emailConfig.emailDestination}
                onChange={(e) => setEmailConfig({...emailConfig, emailDestination: e.target.value})}
                style={{width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
              />
            </div>
          </div>

          <button
            onClick={handleEmailSave}
            style={{
              padding: '0.6rem 1.5rem',
              background: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Guardar Configuración
          </button>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div style={{background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{marginTop: 0, marginBottom: '1.5rem'}}>Cambiar Contraseña</h3>
          
          <div style={{maxWidth: '500px'}}>
            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                Contraseña Actual
              </label>
              <input
                type="password"
                value={securityData.currentPassword}
                onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                style={{width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
              />
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={securityData.newPassword}
                onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                style={{width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
              />
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500}}>
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                style={{width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', borderRadius: '6px'}}
              />
            </div>

            <button
              onClick={handleSecuritySave}
              style={{
                padding: '0.6rem 1.5rem',
                background: '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Actualizar Contraseña
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
