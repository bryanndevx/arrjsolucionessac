import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class SendMailDto {
  @IsString()
  @IsNotEmpty()
  name: string

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
  @IsNotEmpty()
  message: string

  @IsOptional()
  items?: string[]
}
