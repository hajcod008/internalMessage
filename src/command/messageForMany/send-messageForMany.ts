import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { MessageEntity } from '../entities/message.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { mapMessageEntity } from '../entities/map-message.entity';
import { MessageService } from '../message.service';
import { Request_Was_Successful1 } from 'src/common/translate/success.translate';
import {
  InternalServerError,
  Unauthorized,
} from 'src/common/translate/errors.translate';
import { SYSTEM } from '../entities/systemName.entity';

@Injectable()
export class sendMessageMany {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(mapMessageEntity)
    private readonly mapMessageRepository: Repository<mapMessageEntity>,
    @InjectRepository(SYSTEM)
    private readonly systemRepository: Repository<SYSTEM>,
    private readonly connection: Connection,
    private readonly messageService: MessageService,
  ) {}
  async messageForMany(AddAndSendMessageDto: any, userId: any): Promise<any> {
    const { message_text, Title, system } = AddAndSendMessageDto;
    try {
      const existingSystem = await SYSTEM.findOne({
        where: {
          system_name: system,
        },
      });
      if (!existingSystem || existingSystem.system_name !== system) {
        throw new HttpException(Unauthorized, Unauthorized.status_code);
      }
      const queryRunner = this.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        let message = new MessageEntity();
        message.message_text = message_text;
        message.Title = Title;
        message.system_name = system;
        await queryRunner.manager.save(message);
        var messageId = message.id;
        const allUsers = [];
        allUsers.push(userId);
        console.log(allUsers);
        const users = allUsers[0].split(',');
        for (let userIds of users) {
          let mapM = new mapMessageEntity();
          mapM.message_id = messageId;
          mapM.user_id = userIds;
          await queryRunner.manager.save(mapM);
        }
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
      throw new HttpException(
        Request_Was_Successful1,
        Request_Was_Successful1.status_code,
      );
    } catch (error) {
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else throw error;
    }
  }
}
