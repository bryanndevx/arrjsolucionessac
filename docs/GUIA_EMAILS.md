# 📧 GUÍA DE CONFIGURACIÓN - EMAILJS

## ✅ OPCIÓN 1: EmailJS (IMPLEMENTADA) - LA MÁS FÁCIL

### 🎯 Ventajas:
- ✅ NO necesitas backend
- ✅ Configuración en 5 minutos
- ✅ 200 emails gratis al mes
- ✅ Se integra directo con tu Gmail
- ✅ Funciona desde el frontend

### 📝 Pasos de Configuración:

#### 1. Crear cuenta en EmailJS
1. Ve a: https://www.emailjs.com/
2. Clic en "Sign Up" (registro gratuito)
3. Verifica tu email

#### 2. Conectar tu Gmail
1. En el dashboard, ve a "Email Services"
2. Clic en "Add New Service"
3. Selecciona "Gmail"
4. Autoriza tu cuenta de Gmail
5. Copia el **SERVICE_ID** que aparece (ej: `service_abc1234`)

#### 3. Crear Template de Email
1. Ve a "Email Templates"
2. Clic en "Create New Template"
3. Usa este template para CONTACTO:

```
Subject: Nueva Consulta - {{subject}}

Hola ARRJ Soluciones,

Has recibido una nueva consulta:

Nombre: {{from_name}}
Email: {{from_email}}
Teléfono: {{phone}}
Motivo: {{subject}}

Mensaje:
{{message}}

---
Este email fue enviado desde el formulario de contacto de tu sitio web.
```

4. Guarda y copia el **TEMPLATE_ID** (ej: `template_xyz5678`)

5. Crea otro template para COTIZACIONES:

```
Subject: Nueva Solicitud de Cotización

Hola ARRJ Soluciones,

Nueva solicitud de cotización recibida:

Cliente: {{from_name}}
Empresa: {{company}}
Email: {{from_email}}
Teléfono: {{phone}}

Detalles:
{{message}}

---
Responde a este cliente dentro de las próximas 24 horas.
```

#### 4. Obtener Public Key
1. Ve a "Account" → "General"
2. Busca "Public Key"
3. Copia tu **PUBLIC_KEY** (ej: `abc123XYZ456`)

#### 5. Configurar en tu Proyecto
1. Edita el archivo `.env.local` en la carpeta `frontend/`:

```env
VITE_EMAILJS_PUBLIC_KEY=tu_public_key_aqui
VITE_EMAILJS_SERVICE_ID=tu_service_id_aqui
VITE_EMAILJS_TEMPLATE_ID=tu_template_id_aqui
```

2. Reemplaza los valores con los que copiaste

3. En `Contact.tsx` y `Cart.tsx`, cambia esta línea:
```tsx
to_email: 'tu-email@ejemplo.com', // ← Pon tu email real aquí
```

#### 6. Probar
1. Reinicia el servidor: `npm run dev`
2. Ve a la página de Contacto
3. Llena el formulario
4. ¡Deberías recibir el email en segundos!

---

## 📱 OPCIÓN 2: WhatsApp Business API (MÁS DIRECTO)

### Ventajas:
- ✅ Los clientes ya usan WhatsApp
- ✅ Respuestas más rápidas
- ✅ Gratis (WhatsApp Web)
- ✅ No necesitas código adicional

### Implementación Simple:

Cambia los botones de formulario por enlaces de WhatsApp:

```tsx
// En ProductCard.tsx o donde quieras
const whatsappMessage = `Hola, me interesa el ${product.name}. ¿Podrían darme más información?`
const whatsappLink = `https://wa.me/51987654321?text=${encodeURIComponent(whatsappMessage)}`

<a href={whatsappLink} target="_blank" className="btn-whatsapp">
  💬 Consultar por WhatsApp
</a>
```

---

## 🔐 OPCIÓN 3: Backend con Node.js + Nodemailer (MÁS PROFESIONAL)

### Ventajas:
- ✅ Control total
- ✅ Validaciones en servidor
- ✅ Base de datos de consultas
- ✅ Emails ilimitados

### Requiere:
- Servidor backend (ya tienes uno básico)
- Configurar SMTP de Gmail
- Base de datos (MongoDB/PostgreSQL)

### Código Backend (si quieres implementarlo):

```javascript
// backend/index.js
import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

// Configurar transportador de emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tu-email@gmail.com',
    pass: 'tu-app-password' // Generar en Google Account → Security → App Passwords
  }
})

// Endpoint para contacto
app.post('/api/contact', async (req, res) => {
  const { nombre, email, telefono, motivo, mensaje } = req.body

  try {
    await transporter.sendMail({
      from: 'tu-email@gmail.com',
      to: 'tu-email@gmail.com',
      subject: `Nueva Consulta - ${motivo}`,
      html: `
        <h2>Nueva Consulta Recibida</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Motivo:</strong> ${motivo}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `
    })

    res.json({ success: true, message: 'Email enviado' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: 'Error al enviar email' })
  }
})

app.listen(3000, () => console.log('Backend corriendo en puerto 3000'))
```

---

## 🎯 RECOMENDACIÓN FINAL

**Para empezar YA**: Usa **OPCIÓN 1 (EmailJS)** ← YA ESTÁ IMPLEMENTADO
- Funciona en 5 minutos
- Gratis hasta 200 emails/mes
- No necesitas backend

**Para mediano plazo**: Combina EmailJS + WhatsApp
- Emails para cotizaciones formales
- WhatsApp para consultas rápidas

**Para futuro**: Backend con Nodemailer
- Cuando tengas muchos clientes (>200/mes)
- Si necesitas guardar histórico de consultas
- Si quieres automatizaciones avanzadas

---

## 🚀 PRÓXIMOS PASOS

1. ✅ **HECHO**: Código implementado en Contact.tsx y Cart.tsx
2. ⏳ **TÚ**: Configurar EmailJS (5 minutos)
3. ⏳ **TÚ**: Poner tus credenciales en `.env.local`
4. ⏳ **TÚ**: Cambiar `to_email` por tu email real
5. ✅ **PROBAR**: Enviar un email de prueba

---

## ❓ PREGUNTAS FRECUENTES

**P: ¿Es seguro EmailJS?**
R: Sí, es usado por miles de empresas. La API key va en el frontend pero solo permite ENVIAR emails, no leer ni acceder a tu cuenta.

**P: ¿Qué pasa si supero 200 emails/mes?**
R: Plan de pago desde $10/mes (1000 emails) o migrar a backend con Nodemailer (gratis ilimitado).

**P: ¿Los emails llegarán a spam?**
R: Muy raro. EmailJS tiene buena reputación. Si pasa, pide al cliente agregarte a contactos.

**P: ¿Puedo personalizar el diseño del email?**
R: Sí, en el template de EmailJS puedes usar HTML completo con estilos.

---

## 📞 SOPORTE

- EmailJS Docs: https://www.emailjs.com/docs/
- Video tutorial: https://www.youtube.com/watch?v=NgWGllOjkbs
- Si tienes problemas, revisa la consola del navegador (F12)
