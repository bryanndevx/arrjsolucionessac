import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { InventoryService } from './inventory.service'

@Controller('inventories')
export class InventoryController {
  constructor(private service: InventoryService) {}

  @Get()
  async list() {
    return this.service.findAll()
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.service.findOne(+id)
  }

  @Post()
  async create(@Body() body: any) {
    return this.service.create(body)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(+id, body)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(+id)
  }
}
