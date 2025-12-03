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
    const textParts: string[] = []
    if (payload.name) textParts.push(`Nombre: ${payload.name}`)
    if (payload.email) textParts.push(`Email: ${payload.email}`)
    if (payload.phone) textParts.push(`Teléfono: ${payload.phone}`)
    if (payload.company) textParts.push(`Empresa: ${payload.company}`)
    if (payload.items) textParts.push(`Items: ${Array.isArray(payload.items) ? payload.items.join(', ') : payload.items}`)
    if (payload.message) textParts.push(`Mensaje:\n${payload.message}`)

    const text = textParts.join('\n')

    // Send to company / destination
    const companySubject = subject
    const infoCompany = await this.sendMail({ to: companyTo, subject: companySubject, text })

    // Send confirmation to requester if provided and different from company destination
    let infoRequester = null
    if (requester) {
      try {
        if (String(requester).toLowerCase() !== String(companyTo).toLowerCase()) {
          const confSubject = `Confirmación de recepción — ${payload.name || 'Solicitud'}`
          const confText = `Hemos recibido su solicitud de cotización.\n\nResumen:\n${text}\n\nNos pondremos en contacto pronto.`
          infoRequester = await this.sendMail({ to: requester, subject: confSubject, text: confText })
        } else {
          // If requester is same as company destination, skip duplicate send
          this.logger.log('Requester email equals company destination; skipping confirmation send')
        }
      } catch (err) {
        this.logger.warn('Failed to send confirmation to requester: ' + String(err))
      }
    }

    return { company: infoCompany?.messageId, requester: infoRequester?.messageId }
  }
}
