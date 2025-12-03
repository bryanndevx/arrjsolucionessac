import { Controller, Get, Param } from '@nestjs/common'
import { CategoriesService } from './categories.service'

@Controller('categories')
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  @Get()
  async list() {
    return this.service.findAll()
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.service.findOne(+id)
  }
}
