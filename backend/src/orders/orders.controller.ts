import { Body, Controller, Get, Post, Param, Patch, Query, HttpCode, HttpStatus } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateOrderDto) {
    const order = await this.ordersService.create(dto)
    return {
      success: true,
      message: 'Order created successfully',
      data: order
    }
  }

  @Get()
  async findAll() {
    const orders = await this.ordersService.findAll()
    return {
      success: true,
      data: orders
    }
  }

  @Get('stats')
  async getStats() {
    const stats = await this.ordersService.getStats()
    return {
      success: true,
      data: stats
    }
  }

  @Get('reports/:type')
  async getReport(
    @Param('type') type: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string
  ) {
    const report = await this.ordersService.getReportData(type, dateFrom, dateTo)
    return {
      success: true,
      data: report
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOne(+id)
    return {
      success: true,
      data: order
    }
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const order = await this.ordersService.updateStatus(+id, status)
    return {
      success: true,
      message: 'Status updated successfully',
      data: order
    }
  }
}
