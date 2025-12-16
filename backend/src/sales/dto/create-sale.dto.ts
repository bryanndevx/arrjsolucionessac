import { IsOptional, IsString, IsNumber } from 'class-validator'

export class CreateSaleDto {
  @IsOptional()
  @IsString()
  customerName?: string

  @IsOptional()
  @IsString()
  email?: string

  @IsOptional()
  @IsString()
  phone?: string

  // items can be sent as array or JSON string; we'll accept string here
  @IsOptional()
  @IsString()
  items?: string

  @IsOptional()
  @IsNumber()
  total?: number

  @IsOptional()
  @IsString()
  notes?: string

  @IsOptional()
  @IsString()
  status?: string

  @IsOptional()
  @IsString()
  token?: string

  @IsOptional()
  @IsString()
  tokenExpires?: string

  @IsOptional()
  @IsString()
  buyerDetails?: string
}
