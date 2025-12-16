import { Module } from '@nestjs/common'
import { MailService } from './mail.service'
import { MailController } from './mail.controller'
import { SalesModule } from '../sales/sales.module'

@Module({
  imports: [SalesModule],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService]
})
export class MailModule {}
