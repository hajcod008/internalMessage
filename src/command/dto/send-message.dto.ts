import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  MaxLength,
  IsMobilePhone,
  IsEmpty,
  IsOptional,
  IsUrl,
  IsString,
} from 'class-validator';

export class AddAndSendMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  Title: string;

  @ApiProperty({ example: 'test mikonam ' })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  message_text: string;

  @IsOptional()
  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @ApiProperty({ example: 'javad' })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  system: string;
}

export class AddAndSendMessageResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  @IsString()
  result:string;
  @ApiProperty()
  @IsString()
  message: string;
}
