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
    const to = process.env.EMAIL_DESTINATION || payload.email || process.env.SMTP_USER
    const subject = payload.subject || `Nuevo mensaje desde sitio: ${payload.name || 'Sin nombre'}`
    const textParts = []
    if (payload.name) textParts.push(`Nombre: ${payload.name}`)
    if (payload.email) textParts.push(`Email: ${payload.email}`)
    if (payload.phone) textParts.push(`Teléfono: ${payload.phone}`)
    if (payload.company) textParts.push(`Empresa: ${payload.company}`)
    if (payload.items) textParts.push(`Items: ${Array.isArray(payload.items) ? payload.items.join(', ') : payload.items}`)
    if (payload.message) textParts.push(`Mensaje:\n${payload.message}`)

    const text = textParts.join('\n')

    return this.sendMail({ to, subject, text })
  }
}
