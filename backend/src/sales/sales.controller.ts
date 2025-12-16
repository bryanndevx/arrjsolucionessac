import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch } from '@nestjs/common'
import { SalesService } from './sales.service'
import { CreateSaleDto } from './dto/create-sale.dto'

@Controller('sales')
export class SalesController {
  constructor(private readonly service: SalesService) {}

  @Post()
  async create(@Body() dto: CreateSaleDto) {
    return this.service.create(dto)
  }

  @Get()
  async list() {
    return this.service.findAll()
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    const sale = await this.service.findOne(id)
    if (!sale) return { ok: false, error: 'Sale not found' }

    const now = new Date()
    const tokenExpires = sale.tokenExpires ? new Date(sale.tokenExpires) : null
    const tokenExpired = tokenExpires ? tokenExpires < now : true

    // Decide message / status for frontend
    let message = null
    if (sale.status === 'completed') {
      message = 'Compra ya completada'
    } else if (tokenExpired) {
      message = 'Compra expirada'
    }

    return { ok: true, sale, tokenExpired, message }
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<CreateSaleDto>) {
    const sale = await this.service.findOne(id)
    if (!sale) return { ok: false, error: 'Sale not found' }

    // If already completed, do not allow re-completion
    if (sale.status === 'completed') {
      return { ok: false, error: 'Sale already completed' }
    }

    // If the request tries to set status to completed or provide buyerDetails, require valid token
    if ((body.status === 'completed' || body.buyerDetails) && body.token) {
      const token = body.token
      if (!sale.token || String(sale.token) !== String(token)) {
        return { ok: false, error: 'Invalid token' }
      }
      if (sale.tokenExpires && new Date(sale.tokenExpires) < new Date()) {
        return { ok: false, error: 'Token expired' }
      }
    }

    return this.service.update(id, body as any)
  }
}
