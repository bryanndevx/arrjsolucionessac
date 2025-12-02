import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Inventory } from './inventory.entity'
import { Product } from '../products/products.entity'

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory) private repo: Repository<Inventory>,
    @InjectRepository(Product) private productRepo: Repository<Product>
  ) {}

  findAll() {
    // Explicitly load product and product.category to ensure frontend receives category name
    return this.repo.find({ relations: ['product', 'product.category'] })
  }

  async findOne(id: number) {
    const inv = await this.repo.findOne({ where: { id }, relations: ['product', 'product.category'] })
    if (!inv) throw new NotFoundException('Inventory not found')
    return inv
  }

  async create(data: Partial<Inventory> & { idProducto?: number }) {
    let product = null
    if (data.idProducto) {
      product = await this.productRepo.findOneBy({ id: data.idProducto })
      if (!product) throw new NotFoundException('Product not found')
    }

    const inv = this.repo.create({
      product: product || (data.product as any),
      stockActual: data.stockActual ?? 0,
      stockMinimo: data.stockMinimo ?? 0,
      stockMaximo: data.stockMaximo,
      ubicacion: data.ubicacion
    })

    return this.repo.save(inv)
  }

  async update(id: number, changes: Partial<Inventory> & { idProducto?: number }) {
    const inv = await this.findOne(id)

    if (changes.idProducto) {
      const p = await this.productRepo.findOneBy({ id: changes.idProducto })
      if (!p) throw new NotFoundException('Product not found')
      inv.product = p
    }

    if (typeof changes.stockActual !== 'undefined') inv.stockActual = changes.stockActual
    if (typeof changes.stockMinimo !== 'undefined') inv.stockMinimo = changes.stockMinimo
    if (typeof changes.stockMaximo !== 'undefined') inv.stockMaximo = changes.stockMaximo
    if (typeof changes.ubicacion !== 'undefined') inv.ubicacion = changes.ubicacion

    return this.repo.save(inv)
  }

  async remove(id: number) {
    const inv = await this.findOne(id)
    return this.repo.remove(inv)
  }
}
