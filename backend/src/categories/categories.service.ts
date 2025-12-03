import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Category } from './category.entity'

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  findAll() {
    return this.repo.find()
  }

  async findOne(id: number) {
    const c = await this.repo.findOne({ where: { idCategoria: id } })
    if (!c) throw new NotFoundException('Category not found')
    return c
  }
}
