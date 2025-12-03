import { Controller, Get, Param, Patch, Body } from '@nestjs/common'
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

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(+id, body)
  }
}
