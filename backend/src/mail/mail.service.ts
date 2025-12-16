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

    // Build HTML email
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2>Hemos recibido su solicitud de cotización.</h2>
        <p><strong>Resumen:</strong></p>
        <div style="margin-bottom: 8px">${parts.map(p => `<div>${p}</div>`).join('')}</div>
        <div style="margin-bottom:8px"><strong>Items:</strong>${itemsHtml || '<div>—</div>'}</div>
        <div style="margin-top:12px; padding:12px; background:#f6f6f6; border-radius:6px;">
          <p style="margin:0; white-space:pre-wrap">${payload.message ?? ''}</p>
        </div>
        <div style="margin-top:16px">
          <p><strong>Resumen financiero:</strong></p>
          <div>Subtotal: ${payload.subtotal ?? '—'}</div>
          <div>IGV (18%): ${payload.igv ?? '—'}</div>
          <div><strong>Total: ${payload.total ?? '—'}</strong></div>
        </div>
        <div style="margin-top:20px; text-align:center">
          <a href="${ctaUrl}" style="display:inline-block;padding:12px 20px;background:#1a73e8;color:#fff;border-radius:6px;text-decoration:none">Confirmar compra</a>
        </div>
        <p style="color:#666; font-size:12px; margin-top:18px">Si no solicitó esto, ignore este correo.</p>
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
