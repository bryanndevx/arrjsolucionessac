import { Body, Controller, Post } from '@nestjs/common'
import { MailService } from './mail.service'

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async send(@Body() body: any) {
    // body expected: { name, email, phone, company, message, items, subject }
    const res = await this.mailService.sendContact(body)
    return { ok: true, id: res?.messageId }
  }
}
