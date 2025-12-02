import { Controller, Get, Param } from '@nestjs/common'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
  constructor(private service: ProductsService) {}

  @Get()
  async list() {
    return this.service.findAll()
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.service.findOne(+id)
  }
}
