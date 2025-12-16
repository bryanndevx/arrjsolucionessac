import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity({ name: 'sales' })
export class Sale {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  customerName?: string

  @Column({ nullable: true })
  email?: string

  @Column({ nullable: true })
  phone?: string

  // Store items as JSON string
  @Column({ type: 'text', nullable: true })
  items?: string

  @Column({ type: 'real', nullable: true })
  total?: number

  @Column({ default: 'pending' })
  status: string

  @Column({ type: 'text', nullable: true })
  notes?: string

  @Column({ type: 'text', nullable: true })
  buyerDetails?: string

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date
}
