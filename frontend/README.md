# Frontend - ARRJ SOLUCIONES S.A.C.

Aplicación web React + TypeScript para alquiler y venta de maquinaria pesada.

---

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar EmailJS
cp .env.example .env.local
# Edita .env.local con tus credenciales

# Iniciar desarrollo
npm run dev
```

Abre: http://localhost:5173

---

## 📦 Tecnologías

- **React 19.2.0** - Framework UI
- **TypeScript 5.9.3** - Tipado estático
- **Vite 7.2.2** - Build tool
- **React Router DOM 6.14.1** - Routing
- **EmailJS** - Envío de emails
- **CSS Modules** - Estilos

---

## 📁 Estructura

```
src/
├── components/
│   ├── layout/          # Header, Footer
│   ├── common/          # ProductCard
│   └── features/        # Features específicos
├── pages/               # Home, Catalog, Product, Cart, About, Contact
├── contexts/            # CartContext (estado global)
├── types/               # TypeScript interfaces
├── constants/           # products.data.ts (50 productos)
├── utils/               # format.ts (helpers)
└── styles/              # CSS global
```

---

## ⚙️ Scripts

```bash
npm run dev          # Desarrollo (localhost:5173)
npm run build        # Build producción
npm run preview      # Preview del build
npm run lint         # ESLint
```

---

## 🔧 Configuración

### **Variables de Entorno (.env.local)**

```env
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_CONTACT_ID=template_contacto
VITE_EMAILJS_TEMPLATE_QUOTE_ID=template_cotizacion
VITE_EMAIL_DESTINO=tu-email@gmail.com
```

---

## 📄 Páginas

- `/` - Home (Hero + Preview)
- `/catalog` - Catálogo con filtros
- `/product/:id` - Detalle de producto
- `/cart` - Carrito y cotización
- `/about` - Quiénes somos
- `/contact` - Formulario de contacto

---

## 🎨 Componentes Principales

### **ProductCard**
```tsx
<ProductCard product={product} />
```

### **Header**
Navegación + Carrito con badge

### **Footer**
Información de contacto y redes

---

## 📧 EmailJS

El proyecto usa EmailJS para enviar emails sin backend.

**Templates necesarios:**
1. Contacto (`VITE_EMAILJS_TEMPLATE_CONTACT_ID`)
2. Cotización (`VITE_EMAILJS_TEMPLATE_QUOTE_ID`)

Ver: `docs/GUIA_EMAILS.md`

---

## 🛒 Context API

### **CartContext**
Gestiona el estado del carrito:

```tsx
const { items, add, remove, updateQuantity, clear, totalCount } = useCart()
```

---

## 📱 Responsive

Breakpoints:
- Desktop: > 900px
- Tablet: 640px - 900px
- Mobile: < 640px

---

## 🚀 Deploy

### **Vercel (Recomendado)**
```bash
npm run build
# Conectar con Vercel
```

### **Netlify**
```bash
npm run build
# Deploy carpeta dist/
```

---

## 📝 Notas

- Los productos están hardcodeados en `constants/products.data.ts`
- El carrito usa localStorage para persistencia
- EmailJS tiene límite de 200 emails/mes (plan gratuito)

---

**¿Problemas?** Ver README principal o `docs/`
