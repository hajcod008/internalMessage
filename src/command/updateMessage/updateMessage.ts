import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '../entities/message.entity';
import { Connection, Repository } from 'typeorm';
import { mapMessageEntity } from '../entities/map-message.entity';
import { MessageService } from '../message.service';
import { Request_Was_Successful1 } from 'src/common/translate/success.translate';
import {
  Bad_Request_Exception,
  DataNotFound,
  InternalServerError,
  Reset_update_message_Faild,
} from 'src/common/translate/errors.translate';
import moment from 'moment';

@Injectable()
export class updateMessage {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(mapMessageEntity)
    private readonly mapMessageRepository: Repository<mapMessageEntity>,
    private readonly connection: Connection,
    private readonly messageService: MessageService,
  ) {}

  async messageUpdate(
    AddAndSendMessageDto: any,
    messageId: any,
  ): Promise<any> {
    const { message_text, Title, mobile_number } = AddAndSendMessageDto;
    try {
      const message = await this.messageRepository.findOne({
        where: {
          id: messageId,
          is_deleted: false,
        },
      });
      const createdAt = message.created_at;
      const now = new Date();
      const diff = now.getTime() - createdAt.getTime();
      const hoursPassed = diff / (1000 * 60 * 60);
      if (hoursPassed > 24) {
        throw new HttpException(
          Reset_update_message_Faild,
          Reset_update_message_Faild.status_code,
        );
      } else {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          let message = new MessageEntity();
          message.id = messageId;
          message.Title = Title;
          message.message_text = message_text;
         
          await queryRunner.manager.save(message);

          await queryRunner.commitTransaction();
        } catch (error) {
          await queryRunner.rollbackTransaction();
        } finally {
          await queryRunner.release();
        }
        throw new HttpException(
          Request_Was_Successful1,
          Request_Was_Successful1.status_code,
        );
      }
    } catch (error) {
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else throw error;
    }
  }
}
