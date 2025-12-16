import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator'

export class CreateRentalDto {
  @IsOptional()
  @IsString()
  customerName?: string

  @IsOptional()
  @IsString()
  email?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  items?: string

  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string

  @IsOptional()
  @IsNumber()
  days?: number

  @IsOptional()
  @IsNumber()
  pricePerDay?: number

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
