import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Product } from '../products/products.entity'

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('increment', { name: 'idCategoria' })
  idCategoria: number

  @Column({ type: 'varchar', length: 255 })
  nombre: string

  @Column({ type: 'text', nullable: true })
  descripcion?: string

  @Column({ type: 'boolean', default: true })
  estado?: boolean

  @CreateDateColumn({ type: 'datetime', name: 'createdAt' })
  createdAt?: Date

  @UpdateDateColumn({ type: 'datetime', name: 'updatedAt' })
  updatedAt?: Date

  @OneToMany(() => Product, (product) => product.category)
  products?: Product[]
}
