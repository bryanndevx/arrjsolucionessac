import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { Product } from './products/products.entity'
import { ProductsModule } from './products/products.module'
import { User } from './users/user.entity'
import { Category } from './categories/category.entity'
import { Inventory } from './inventory/inventory.entity'
import { Sale } from './sales/sale.entity'
import { SalesModule } from './sales/sales.module'
import { InventoryModule } from './inventory/inventory.module'
import { CategoriesModule } from './categories/categories.module'
import { MailModule } from './mail/mail.module'
import { SqliteInitService } from './db/sqlite-init.service'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_PATH || 'data/database.sqlite',
      synchronize: true,
      logging: false,
      entities: [User, Product, Category, Inventory, Sale],
      // Pasar opciones extra al driver sqlite3 (busyTimeout en ms)
      extra: {
        busyTimeout: 60000
      }
    }),
    UsersModule,
    AuthModule,
    InventoryModule,
    CategoriesModule,
    ProductsModule
    ,MailModule,
    SalesModule
  ],
  controllers: [],
  providers: [SqliteInitService]
})
export class AppModule {}
