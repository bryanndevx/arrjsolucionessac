import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RentalsService } from './rentals.service'
import { RentalsController } from './rentals.controller'
import { Rental } from './rental.entity'
import { MailModule } from '../mail/mail.module'

@Module({
  imports: [TypeOrmModule.forFeature([Rental]), MailModule],
  providers: [RentalsService],
  controllers: [RentalsController],
  exports: [RentalsService]
})
export class RentalsModule {}
