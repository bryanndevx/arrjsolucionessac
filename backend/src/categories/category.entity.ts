import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

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
}
