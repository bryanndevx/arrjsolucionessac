import { Injectable, Logger } from '@nestjs/common'
import nodemailer from 'nodemailer'

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter
  private logger = new Logger(MailService.name)

  constructor() {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com'
    const port = Number(process.env.SMTP_PORT || 587)
    const secure = String(process.env.SMTP_SECURE || 'false') === 'true'

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    // Optional verify transporter on startup (will log but not throw)
    this.transporter.verify().then(() => {
      this.logger.log('Mail transporter verified')
    }).catch((err) => {
      this.logger.warn('Mail transporter verification failed: ' + String(err))
    })
  }

  async sendMail(opts: { to: string; subject: string; text?: string; html?: string }) {
    const from = process.env.EMAIL_FROM || process.env.SMTP_USER
    const mail = {
      from,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html
    }
    const info = await this.transporter.sendMail(mail)
    this.logger.log(`Email sent: ${info.messageId}`)
    return info
  }

  // Helper to send generic contact/quote payloads
  async sendContact(payload: any) {
    const companyTo = process.env.EMAIL_DESTINATION || process.env.SMTP_USER
    const requester = payload.email
    const subject = payload.subject || `Nueva solicitud desde sitio: ${payload.name || 'Sin nombre'}`
    const parts: string[] = []
    if (payload.name) parts.push(`Nombre: ${payload.name}`)
    if (payload.email) parts.push(`Email: ${payload.email}`)
    if (payload.phone) parts.push(`Teléfono: ${payload.phone}`)
    if (payload.company) parts.push(`Empresa: ${payload.company}`)
    if (payload.message) parts.push(`Mensaje:\n${payload.message}`)

    // Prepare items rendering
    let itemsHtml = ''
    let itemsText = ''
    try {
      const items = Array.isArray(payload.items) ? payload.items : JSON.parse(payload.items || '[]')
      if (Array.isArray(items) && items.length) {
        itemsHtml = `<ul>${items.map((it: any) => `<li>${it.name ?? it.productName ?? JSON.stringify(it)} ${it.qty ? ` — ${it.qty}` : ''}</li>`).join('')}</ul>`
        itemsText = items.map((it: any) => `- ${it.name ?? it.productName ?? JSON.stringify(it)} ${it.qty ? ` — ${it.qty}` : ''}`).join('\n')
      }
    } catch (err) {
      // fallback: show raw items
      itemsText = String(payload.items || '')
      itemsHtml = `<pre>${itemsText}</pre>`
    }

    const text = parts.concat(itemsText ? [`Items:\n${itemsText}`] : []).join('\n')

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const ctaUrl = payload.ctaUrl || (payload.saleId ? `${frontendUrl}/checkout?saleId=${payload.saleId}` : frontendUrl)

    const fmt = (n: any) => {
      const num = Number(n)
      if (isNaN(num)) return '—'
      return 'S/ ' + num.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    // Build HTML email
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #222; max-width:600px;">
        <div style="background:#0f172a;color:#fff;padding:16px;border-radius:6px 6px 0 0">
          <h2 style="margin:0">Solicitud de Cotización recibida</h2>
        </div>
        <div style="background:#fff;padding:18px;border:1px solid #eee;border-top:0">
          <p style="margin:0 0 8px 0"><strong>Resumen del cliente</strong></p>
          <div style="margin-bottom:12px">${parts.map(p => `<div style="margin:2px 0">${p}</div>`).join('')}</div>

          <p style="margin:10px 0 6px"><strong>Items</strong></p>
          <div style="margin-bottom:12px">${itemsHtml || '<div>—</div>'}</div>

          <div style="padding:12px;background:#f9fafb;border-radius:6px;margin-bottom:12px">
            <div style="display:flex;justify-content:space-between"><div>Subtotal</div><div>${fmt(payload.subtotal)}</div></div>
            <div style="display:flex;justify-content:space-between"><div>IGV (18%)</div><div>${fmt(payload.igv)}</div></div>
            <hr style="border:none;border-top:1px solid #eee;margin:8px 0" />
            <div style="display:flex;justify-content:space-between;font-weight:700"><div>Total</div><div>${fmt(payload.total)}</div></div>
          </div>

          <div style="text-align:center;margin-top:14px">
            <a href="${ctaUrl}" style="display:inline-block;padding:12px 20px;background:#1a73e8;color:#fff;border-radius:6px;text-decoration:none">Confirmar compra</a>
          </div>

          <p style="color:#666;font-size:12px;margin-top:14px">Si no solicitó esto, ignore este correo.</p>
        </div>
      </div>
    `

    // Send to company / destination (HTML + text)
    const companySubject = subject
    const infoCompany = await this.sendMail({ to: companyTo, subject: companySubject, text, html: htmlBody })

    // Send confirmation to requester if provided and different from company destination
    let infoRequester = null
    if (requester) {
      try {
        if (String(requester).toLowerCase() !== String(companyTo).toLowerCase()) {
          const confSubject = `Confirmación de recepción — ${payload.name || 'Solicitud'}`
          const confText = `Hemos recibido su solicitud de cotización.\n\nResumen:\n${text}\n\nNos pondremos en contacto pronto.`
          const requesterHtml = `
            <div style="font-family: Arial, sans-serif; color:#222;">
              <h3>Hemos recibido su solicitud de cotización.</h3>
              <div>${parts.map(p => `<div>${p}</div>`).join('')}</div>
              <div><strong>Items:</strong>${itemsHtml || '<div>—</div>'}</div>
              <div style="margin-top:16px;text-align:center">
                <a href="${ctaUrl}" style="display:inline-block;padding:12px 20px;background:#1a73e8;color:#fff;border-radius:6px;text-decoration:none">Completar compra</a>
              </div>
            </div>
          `
          infoRequester = await this.sendMail({ to: requester, subject: confSubject, text: confText, html: requesterHtml })
        } else {
          this.logger.log('Requester email equals company destination; skipping confirmation send')
        }
      } catch (err) {
        this.logger.warn('Failed to send confirmation to requester: ' + String(err))
      }
    }

    return { company: infoCompany?.messageId, requester: infoRequester?.messageId }
  }
}
