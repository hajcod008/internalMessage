import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { mapMessageEntity } from 'src/command/entities/map-message.entity';
import { MessageEntity } from 'src/command/entities/message.entity';
dotenv.config();

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  port: parseInt(process.env.DB_PORT as string),
  database: process.env.DB_NAME,
  entities:[MessageEntity,mapMessageEntity], 
  synchronize: true,
};