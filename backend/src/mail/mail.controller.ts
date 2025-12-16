import { Body, Controller, Post } from '@nestjs/common'
import { MailService } from './mail.service'
import { SalesService } from '../sales/sales.service'

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly salesService: SalesService
  ) {}

  @Post('send')
  async send(@Body() body: any) {
    // body expected: { name, email, phone, company, message, items, subject }
    // Create a pending sale so the user can confirm later via email CTA
    try {
      // generate a one-time token that expires (default 24h)
      const crypto = await import('crypto')
      const token = crypto.randomUUID()
      const expires = new Date(Date.now() + (24 * 60 * 60 * 1000))

      const saleDto = {
        customerName: body.name,
        email: body.email,
        phone: body.phone,
        items: typeof body.items === 'string' ? body.items : JSON.stringify(body.items || []),
        total: body.total,
        notes: body.message,
        status: 'pending',
        token,
        tokenExpires: expires.toISOString()
      }

      const sale = await this.salesService.create(saleDto)

      // build CTA url to frontend checkout with sale id and token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
      const ctaUrl = `${frontendUrl}/checkout?saleId=${sale.id}&token=${token}`

      const mailPayload = { ...body, saleId: sale.id, ctaUrl }
      const res = await this.mailService.sendContact(mailPayload)
      return { ok: true, saleId: sale.id, token, companyMessageId: res?.company ?? null, requesterMessageId: res?.requester ?? null }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  }
}
