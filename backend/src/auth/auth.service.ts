import { Injectable, UnauthorizedException, ServiceUnavailableException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async register(name: string, email: string, password: string, phone?: string) {
    const existing = await this.users.findByEmail(email)
    if (existing) throw new UnauthorizedException('Email already in use')
    const hash = await bcrypt.hash(password, 10)
    try {
      const user = await this.users.create({ name, email, password: hash, phone })
      return { id: user.id, email: user.email, name: user.name }
    } catch (err: any) {
      // Mejorar el mensaje cuando SQLite está bloqueada
      if (err && /SQLITE_BUSY/.test(err.message || '')) {
        throw new ServiceUnavailableException('Base de datos ocupada. Intenta nuevamente en unos segundos.')
      }
      throw err
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email)
    if (!user) return null
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return null
    return user
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password)
    if (!user) throw new UnauthorizedException('Invalid credentials')
    const payload = { sub: user.id, email: user.email, role: user.role }
    return { accessToken: this.jwt.sign(payload), user: { id: user.id, email: user.email, name: user.name, role: user.role } }
  }
}
