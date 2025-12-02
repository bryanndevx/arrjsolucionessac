import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(user: Partial<User>) {
    const u = this.repo.create(user)
    return this.repo.save(u)
  }

  async findByEmail(email: string) {
    return this.repo.findOneBy({ email })
  }

  async findById(id: number) {
    const u = await this.repo.findOneBy({ id })
    if (!u) throw new NotFoundException('User not found')
    return u
  }
}
