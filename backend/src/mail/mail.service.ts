import { Injectable, Logger } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { SendMailDto } from './dto/send-mail.dto'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private transporter: nodemailer.Transporter

  constructor() {
    this.initializeTransporter()
  }

  private initializeTransporter() {
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_SECURE,
      SMTP_USER,
      SMTP_PASS,
      EMAIL_STRICT
    } = process.env

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      this.logger.warn('⚠️  SMTP configuration incomplete. Email service disabled.')
      return
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT, 10),
        secure: SMTP_SECURE === 'true',
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS
        },
        tls: {
          rejectUnauthorized: EMAIL_STRICT === 'true'
        }
      })

      this.logger.log('✅ Mail transporter initialized successfully')
    } catch (error) {
      this.logger.error('❌ Failed to initialize mail transporter', error)
    }
  }

  async sendQuoteMail(dto: SendMailDto): Promise<void> {
    if (!this.transporter) {
      throw new Error('Mail service not configured')
    }

    const destinationEmail = process.env.EMAIL_DESTINATION || dto.email

    try {
      const htmlContent = this.generateQuoteEmailHtml(dto)

      await this.transporter.sendMail({
        from: `"ARRJ Soluciones S.A.C." <${process.env.SMTP_USER}>`,
        to: destinationEmail,
        replyTo: dto.email,
        subject: `Nueva Cotización - ${dto.name}`,
        html: htmlContent,
        text: this.generateQuoteEmailText(dto)
      })

      this.logger.log(`✅ Quote email sent successfully to ${destinationEmail}`)
    } catch (error) {
      this.logger.error('❌ Failed to send quote email', error)
      throw new Error('Failed to send email')
    }
  }

  async sendContactMail(dto: SendMailDto): Promise<void> {
    if (!this.transporter) {
      throw new Error('Mail service not configured')
    }

    const destinationEmail = process.env.EMAIL_DESTINATION || dto.email

    try {
      const htmlContent = this.generateContactEmailHtml(dto)

      await this.transporter.sendMail({
        from: `"ARRJ Soluciones S.A.C." <${process.env.SMTP_USER}>`,
        to: destinationEmail,
        replyTo: dto.email,
        subject: `Nuevo Contacto - ${dto.name}`,
        html: htmlContent,
        text: this.generateContactEmailText(dto)
      })

      this.logger.log(`✅ Contact email sent successfully to ${destinationEmail}`)
    } catch (error) {
      this.logger.error('❌ Failed to send contact email', error)
      throw new Error('Failed to send email')
    }
  }

  private generateQuoteEmailHtml(dto: SendMailDto): string {
    const itemsList = dto.items?.length 
      ? dto.items.map(item => `<li style="margin: 5px 0;">${item}</li>`).join('')
      : '<li>Sin productos especificados</li>'

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .section { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
          .value { margin-bottom: 15px; }
          ul { padding-left: 20px; }
          .footer { text-align: center; color: #666; margin-top: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">📧 Nueva Solicitud de Cotización</h1>
            <p style="margin: 10px 0 0 0;">ARRJ Soluciones S.A.C.</p>
          </div>
          <div class="content">
            <div class="section">
              <h2 style="color: #667eea; margin-top: 0;">👤 Datos del Cliente</h2>
              <div class="label">Nombre:</div>
              <div class="value">${dto.name}</div>
              
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${dto.email}">${dto.email}</a></div>
              
              <div class="label">Teléfono:</div>
              <div class="value"><a href="tel:${dto.phone}">${dto.phone}</a></div>
              
              ${dto.company ? `
                <div class="label">Empresa:</div>
                <div class="value">${dto.company}</div>
              ` : ''}
            </div>

            ${dto.items?.length ? `
              <div class="section">
                <h2 style="color: #667eea; margin-top: 0;">📦 Productos Solicitados</h2>
                <ul>${itemsList}</ul>
              </div>
            ` : ''}

            <div class="section">
              <h2 style="color: #667eea; margin-top: 0;">💬 Mensaje</h2>
              <div style="white-space: pre-wrap;">${dto.message}</div>
            </div>

            <div class="footer">
              <p>Este correo fue generado automáticamente por el sistema de cotizaciones de ARRJ Soluciones S.A.C.</p>
              <p>RUC: 20607929521</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private generateContactEmailHtml(dto: SendMailDto): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .section { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .label { font-weight: bold; color: #4CAF50; margin-bottom: 5px; }
          .value { margin-bottom: 15px; }
          .footer { text-align: center; color: #666; margin-top: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">📨 Nuevo Mensaje de Contacto</h1>
            <p style="margin: 10px 0 0 0;">ARRJ Soluciones S.A.C.</p>
          </div>
          <div class="content">
            <div class="section">
              <h2 style="color: #4CAF50; margin-top: 0;">👤 Datos del Remitente</h2>
              <div class="label">Nombre:</div>
              <div class="value">${dto.name}</div>
              
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${dto.email}">${dto.email}</a></div>
              
              <div class="label">Teléfono:</div>
              <div class="value"><a href="tel:${dto.phone}">${dto.phone}</a></div>
            </div>

            <div class="section">
              <h2 style="color: #4CAF50; margin-top: 0;">💬 Mensaje</h2>
              <div style="white-space: pre-wrap;">${dto.message}</div>
            </div>

            <div class="footer">
              <p>Este correo fue generado automáticamente por el formulario de contacto de ARRJ Soluciones S.A.C.</p>
              <p>RUC: 20607929521</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private generateQuoteEmailText(dto: SendMailDto): string {
    const itemsList = dto.items?.length 
      ? dto.items.join('\n')
      : 'Sin productos especificados'

    return `
NUEVA SOLICITUD DE COTIZACIÓN
==============================

DATOS DEL CLIENTE:
------------------
Nombre: ${dto.name}
Email: ${dto.email}
Teléfono: ${dto.phone}
${dto.company ? `Empresa: ${dto.company}` : ''}

PRODUCTOS SOLICITADOS:
----------------------
${itemsList}

MENSAJE:
--------
${dto.message}

---
Este correo fue generado automáticamente por ARRJ Soluciones S.A.C.
RUC: 20607929521
    `.trim()
  }

  private generateContactEmailText(dto: SendMailDto): string {
    return `
NUEVO MENSAJE DE CONTACTO
==========================

DATOS DEL REMITENTE:
--------------------
Nombre: ${dto.name}
Email: ${dto.email}
Teléfono: ${dto.phone}

MENSAJE:
--------
${dto.message}

---
Este correo fue generado automáticamente por ARRJ Soluciones S.A.C.
RUC: 20607929521
    `.trim()
  }

  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false
    }

    try {
      await this.transporter.verify()
      this.logger.log('✅ SMTP connection verified')
      return true
    } catch (error) {
      this.logger.error('❌ SMTP connection failed', error)
      return false
    }
  }
}
