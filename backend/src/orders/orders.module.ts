import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { Order } from './order.entity'
import { OrderItem } from './order-item.entity'
import { Inventory } from '../inventory/inventory.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Inventory])
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
