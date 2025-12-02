import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { Product } from './products/product.entity'
import { User } from './users/user.entity'
import { SqliteInitService } from './db/sqlite-init.service'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_PATH || 'data/database.sqlite',
      synchronize: true,
      logging: false,
      entities: [User, Product],
      // Pasar opciones extra al driver sqlite3 (busyTimeout en ms)
      extra: {
        busyTimeout: 60000
      }
    }),
    UsersModule,
    AuthModule
  ],
  controllers: [],
  providers: [SqliteInitService]
})
export class AppModule {}
