import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { OrderItem } from './order-item.entity'

export type OrderStatus = 'pending' | 'quoted' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
export type OrderType = 'rental' | 'sale'

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ type: 'varchar', length: 255 })
  customerName: string

  @Column({ type: 'varchar', length: 255 })
  email: string

  @Column({ type: 'varchar', length: 50 })
  phone: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  company?: string

  @Column({ type: 'text', nullable: true })
  message?: string

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  total: number

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: OrderStatus

  // Tipo predominante del pedido (rental si tiene alquileres, sale si todo es venta)
  @Column({ type: 'varchar', length: 50, default: 'rental' })
  type: OrderType

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, eager: true })
  items: OrderItem[]

  @CreateDateColumn({ type: 'datetime', name: 'createdAt' })
  createdAt: Date

  @UpdateDateColumn({ type: 'datetime', name: 'updatedAt' })
  updatedAt: Date
}
