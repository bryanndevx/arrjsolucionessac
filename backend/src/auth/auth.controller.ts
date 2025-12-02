import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const { name, email, password, phone } = body
    return this.auth.register(name, email, password, phone)
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body
    return this.auth.login(email, password)
  }
}
