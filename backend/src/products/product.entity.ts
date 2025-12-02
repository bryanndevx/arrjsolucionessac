import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  name: string

  @Column({ nullable: true })
  description?: string

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price: number

  @Column({ default: true })
  available: boolean
}
