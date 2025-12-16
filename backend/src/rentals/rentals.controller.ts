import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch } from '@nestjs/common'
import { RentalsService } from './rentals.service'
import { CreateRentalDto } from './dto/create-rental.dto'
import { MailService } from '../mail/mail.service'

@Controller('rentals')
export class RentalsController {
  constructor(
    private readonly service: RentalsService,
    private readonly mailService: MailService
  ) {}

  @Post('send')
  async send(@Body() body: any) {
    try {
      const crypto = await import('crypto')
      const token = crypto.randomUUID()
      // Token expires in 3 minutes
      const expires = new Date(Date.now() + (3 * 60 * 1000))

      // Normalize incoming fields similar to mail controller
      const itemsArr = Array.isArray(body.items) ? body.items : (() => {
        try { return JSON.parse(body.items || '[]') } catch { return [] }
      })()
      const itemsJson = JSON.stringify(itemsArr)

      const qtys = itemsArr.map((it: any) => Number(it.qty ?? it.quantity ?? it.days ?? 0)).filter((n: number) => !isNaN(n) && n > 0)
      const days = body.days ?? (qtys.length ? Math.max(...qtys) : undefined)
      const startDate = body.startDate ?? (new Date()).toISOString()
      const endDate = body.endDate ?? (days ? new Date(Date.now() + (Number(days) * 24 * 60 * 60 * 1000)).toISOString() : undefined)
      const pricePerDay = body.pricePerDay ?? (itemsArr.length ? (itemsArr[0].pricePerDay ?? itemsArr[0].price) : undefined)

      const dto: CreateRentalDto = {
        customerName: body.name ?? body.customerName,
        email: body.email,
        phone: body.phone,
        items: itemsJson,
        startDate,
        endDate,
        days,
        pricePerDay,
        total: body.total,
        notes: body.message,
        status: 'pending',
        token,
        tokenExpires: expires.toISOString()
      }

      const rental = await this.service.create(dto)
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
      const ctaUrl = `${frontendUrl}/checkout-rental?rentalId=${rental.id}&token=${token}`

      const mailPayload = { ...body, rentalId: rental.id, ctaUrl }
      const res = await this.mailService.sendContact(mailPayload)
      return { ok: true, rentalId: rental.id, token, companyMessageId: res?.company ?? null, requesterMessageId: res?.requester ?? null }
    } catch (err) {
      return { ok: false, error: String(err) }
    }
  }

  @Post()
  async create(@Body() dto: CreateRentalDto) {
    return this.service.create(dto)
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    const rental = await this.service.findOne(id)
    if (!rental) return { ok: false, error: 'Rental not found' }

    const now = new Date()
    const tokenExpires = rental.tokenExpires ? new Date(rental.tokenExpires) : null
    const tokenExpired = tokenExpires ? tokenExpires < now : true

    let message = null
    if (rental.status === 'completed') {
      message = 'Reserva ya completada'
    } else if (tokenExpired) {
      message = 'Reserva expirada'
    }

    return { ok: true, rental, tokenExpired, message }
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<CreateRentalDto>) {
    const rental = await this.service.findOne(id)
    if (!rental) return { ok: false, error: 'Rental not found' }

    if (rental.status === 'completed') return { ok: false, error: 'Rental already completed' }

    if ((body.status === 'completed' || body.buyerDetails) && body.token) {
      const token = body.token
      if (!rental.token || String(rental.token) !== String(token)) return { ok: false, error: 'Invalid token' }
      if (rental.tokenExpires && new Date(rental.tokenExpires) < new Date()) return { ok: false, error: 'Token expired' }
    }

    return this.service.update(id, body as any)
  }
}
