import { Optional } from '@nestjs/common';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  MaxLength,
  IsMobilePhone,
  IsEmpty,
  IsOptional,
} from 'class-validator';

export class AddAndSendMessageDto {
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  Title: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  message_text: string;

  @IsNotEmpty()
  // @IsMobilePhone()
  @Matches(/^(\+98|0)?9\d{9}$/, { message: 'Mobile number is not valid' })
  mobile_number: string;

  @IsOptional()
  image: string;

  @IsOptional()
  userId: string;

  @IsOptional()
  email: string;
  
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  system:string
}

export class AddAndSendMessageResponseDto {
  success: boolean;

  result;
  
  message: string;
}
