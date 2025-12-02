import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne
} from 'typeorm'
import { Category } from '../categories/category.entity'
import { Inventory } from '../inventory/inventory.entity'

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number

  // Nombre del producto
  @Column({ type: 'varchar', length: 255 })
  name: string

  // Descripción larga
  @Column({ type: 'text', nullable: true })
  description?: string

  // Resumen corto
  @Column({ type: 'varchar', length: 512, nullable: true })
  short?: string

  // Precio de venta
  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  price: number

  // Precio por día (para alquiler)
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  pricePerDay?: number

  // Tipo: 'sale' | 'rent' | etc.
  @Column({ type: 'varchar', length: 50, nullable: true })
  type?: string

  // Imágenes: almacenadas como simple-array de URLs/rutas
  @Column('simple-array', { nullable: true })
  images?: string[]

  // Relación a Category — el campo en la tabla será `idCategoria` (badge en frontend)
  @ManyToOne(() => Category, (category) => category.products, { nullable: true, onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'idCategoria' })
  category?: Category

  @CreateDateColumn({ type: 'datetime', name: 'createdAt' })
  createdAt?: Date

  @UpdateDateColumn({ type: 'datetime', name: 'updatedAt' })
  updatedAt?: Date

  @OneToOne(() => Inventory, (inventory) => inventory.product)
  inventory?: Inventory
}
