import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common'
import { MailService } from './mail.service'
import { SendMailDto } from './dto/send-mail.dto'

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendMail(@Body() dto: SendMailDto) {
    await this.mailService.sendQuoteMail(dto)
    return {
      success: true,
      message: 'Email sent successfully'
    }
  }

  @Post('contact')
  @HttpCode(HttpStatus.OK)
  async sendContact(@Body() dto: SendMailDto) {
    await this.mailService.sendContactMail(dto)
    return {
      success: true,
      message: 'Contact email sent successfully'
    }
  }
}
