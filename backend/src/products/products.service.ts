import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from './products.entity'

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  findAll() {
    return this.repo.find({ relations: ['category', 'inventory'] })
  }

  async findOne(id: number) {
    const p = await this.repo.findOne({ where: { id }, relations: ['category', 'inventory'] })
    if (!p) throw new NotFoundException('Product not found')
    return p
  }
}
