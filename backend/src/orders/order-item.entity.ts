import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { Order } from './order.entity'

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn('increment')
  id: number

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order

  @Column({ type: 'varchar', length: 255 })
  productName: string

  @Column({ type: 'int', default: 1 })
  quantity: number

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  price: number

  // 'rent' o 'sale'
  @Column({ type: 'varchar', length: 50, default: 'rent' })
  productType: string
}
