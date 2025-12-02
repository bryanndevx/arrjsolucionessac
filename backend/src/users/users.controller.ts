import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() body: any) {
    // body: { name, email, password }
    return this.usersService.create(body)
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.usersService.findById(+id)
  }
}
