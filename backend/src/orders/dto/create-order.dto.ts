import { IsNotEmpty, IsString, IsEmail, IsOptional, IsNumber, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productName: string

  @IsNumber()
  @IsNotEmpty()
  quantity: number

  @IsNumber()
  @IsNotEmpty()
  price: number

  @IsString()
  @IsNotEmpty()
  productType: string // 'rent' | 'sale'
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  phone: string

  @IsString()
  @IsOptional()
  company?: string

  @IsString()
  @IsOptional()
  message?: string

  @IsNumber()
  @IsNotEmpty()
  total: number

  @IsString()
  @IsNotEmpty()
  type: string // 'rental' | 'sale'

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[]
}
