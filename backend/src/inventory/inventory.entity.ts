import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { Product } from '../products/products.entity'

@Entity({ name: 'inventories' })
export class Inventory {
  @PrimaryGeneratedColumn('increment')
  id: number

  // Relación 1:1 con product
  @OneToOne(() => Product, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'idProducto' })
  product: Product

  // Stock actual
  @Column({ type: 'int', default: 0 })
  stockActual: number

  // Stock mínimo
  @Column({ type: 'int', default: 0 })
  stockMinimo: number

  // Stock máximo (opcional)
  @Column({ type: 'int', nullable: true })
  stockMaximo?: number

  // Ubicación física (opcional)
  @Column({ type: 'varchar', length: 255, nullable: true })
  ubicacion?: string

  @CreateDateColumn({ type: 'datetime', name: 'createdAt' })
  createdAt?: Date

  @UpdateDateColumn({ type: 'datetime', name: 'updatedAt' })
  updatedAt?: Date
}
