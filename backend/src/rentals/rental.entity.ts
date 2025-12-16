import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity({ name: 'rentals' })
export class Rental {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  customerName?: string

  @Column({ nullable: true })
  email?: string

  @Column({ nullable: true })
  phone?: string

  @Column({ type: 'text', nullable: true })
  items?: string

  @Column({ type: 'datetime', nullable: true })
  startDate?: Date

  @Column({ type: 'datetime', nullable: true })
  endDate?: Date

  @Column({ type: 'int', nullable: true })
  days?: number

  @Column({ type: 'real', nullable: true })
  pricePerDay?: number

  @Column({ type: 'real', nullable: true })
  total?: number

  @Column({ default: 'pending' })
  status: string

  @Column({ type: 'text', nullable: true })
  notes?: string

  @Column({ type: 'text', nullable: true })
  buyerDetails?: string

  @Column({ type: 'text', nullable: true })
  token?: string

  @Column({ type: 'datetime', nullable: true })
  tokenExpires?: Date

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date
}
