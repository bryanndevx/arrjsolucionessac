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
    return this.service.findOne(id)
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: Partial<CreateSaleDto>) {
    return this.service.update(id, body as any)
  }
}
