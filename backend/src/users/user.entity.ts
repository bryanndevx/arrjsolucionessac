import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export type UserRole = 'admin' | 'user'

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ length: 120 })
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ nullable: true })
  phone?: string

  @Column({ default: 'user' })
  role: UserRole
}
