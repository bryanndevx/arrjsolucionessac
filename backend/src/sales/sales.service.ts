import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Sale } from './sale.entity'
import { CreateSaleDto } from './dto/create-sale.dto'

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name)

  constructor(
    @InjectRepository(Sale)
    private readonly repo: Repository<Sale>
  ) {}

  async create(dto: CreateSaleDto) {
    const sale = this.repo.create({
      customerName: dto.customerName,
      email: dto.email,
      phone: dto.phone,
      items: dto.items,
      total: dto.total,
      notes: dto.notes,
      status: dto.status ?? 'completed'
    })
    const saved = await this.repo.save(sale)
    this.logger.log(`Sale created id=${saved.id}`)
    return saved
  }

  async findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } })
  }

  async findOne(id: number) {
    return this.repo.findOneBy({ id })
  }
}
