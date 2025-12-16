import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Rental } from './rental.entity'
import { CreateRentalDto } from './dto/create-rental.dto'

@Injectable()
export class RentalsService {
  private readonly logger = new Logger(RentalsService.name)

  constructor(
    @InjectRepository(Rental)
    private readonly repo: Repository<Rental>
  ) {}

  async create(dto: CreateRentalDto) {
    const rental = this.repo.create({
      customerName: dto.customerName,
      email: dto.email,
      phone: dto.phone,
      items: dto.items,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      days: dto.days,
      pricePerDay: dto.pricePerDay,
      total: dto.total,
      notes: dto.notes,
      status: dto.status ?? 'pending',
      buyerDetails: dto.buyerDetails,
      token: dto.token,
      tokenExpires: dto.tokenExpires ? new Date(dto.tokenExpires) : undefined
    })
    const saved = await this.repo.save(rental)
    this.logger.log(`Rental created id=${saved.id}`)
    return saved
  }

  async findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } })
  }

  async findOne(id: number) {
    return this.repo.findOneBy({ id })
  }

  async update(id: number, patch: Partial<Rental>) {
    await this.repo.update(id, patch)
    return this.findOne(id)
  }
}
