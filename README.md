# ARRJ Soluciones S.A.C.

Sistema web de catálogo y cotización de maquinaria pesada.

## 🚀 Características

- 📦 Catálogo de 50+ productos (venta y alquiler)
- 🛒 Carrito de cotización
- 📧 Envío de formularios por email (EmailJS)
- 💳 Información de empresa y servicios
- 📱 Diseño responsive

## 🛠️ Tecnologías

- **Frontend**: React 19 + TypeScript + Vite
- **Estilos**: CSS modules
- **Email**: EmailJS
- **Routing**: React Router

## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/bryanndevx/arrjsolucionessac.git
cd arrjsolucionessac/frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de EmailJS

# Iniciar servidor de desarrollo
npm run dev
```

## ⚙️ Configuración de EmailJS

1. Registrarse en [EmailJS](https://www.emailjs.com/)
2. Crear servicio de email (Gmail)
3. Crear 2 templates: uno para contacto y otro para cotizaciones
4. Copiar credenciales a `.env.local`

Ver `.env.example` para las variables requeridas.

## 📂 Estructura del Proyecto

```
arrjsolucionessac/
├── frontend/          # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── constants/
│   │   └── ...
│   └── .env.example   # Template de configuración
└── backend/           # Backend (en desarrollo)
```

## 🚀 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
```

## 👥 Información de la Empresa

**ARRJ SOLUCIONES S.A.C.**  
RUC: 20607929521  
Especialistas en alquiler y venta de maquinaria pesada

## 📄 Licencia

Proyecto privado - ARRJ Soluciones S.A.C.
