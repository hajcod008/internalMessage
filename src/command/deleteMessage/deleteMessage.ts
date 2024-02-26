import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { MessageEntity } from '../entities/message.entity';
import { mapMessageEntity } from '../entities/map-message.entity';
import { MessageService } from '../message.service';
import { Request_Was_Successful1 } from 'src/common/translate/success.translate';
import {
  DataNotFound,
  InternalServerError,
} from 'src/common/translate/errors.translate';

@Injectable()
export class deleteMessage {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(mapMessageEntity)
    private readonly mapMessageRepository: Repository<mapMessageEntity>,
    private readonly connection: Connection,
    private readonly messageService: MessageService,
  ) {}

  async messageDelete(messageId: any): Promise<any> {
    try {
      const message = await this.messageRepository.findOne({
        where: {
          id: messageId,
          is_deleted: false,
        },
      });
      const Mapmessage = await this.mapMessageRepository.findOne({
        where: { message_id: messageId, is_deleted: false },
      });
      if (message !== null && Mapmessage !== null) {
        await this.mapMessageRepository.manager.transaction(
          async (transactionalEntityManager) => {
            const messageConditoin = { id: messageId };
            const mapCondition = { message_id: messageId };
            const partialValue = { is_deleted: true };
            transactionalEntityManager.update(
              MessageEntity,
              messageConditoin,
              partialValue,
            );
            transactionalEntityManager.update(
                mapMessageEntity,
                mapCondition,
                partialValue,
              );
          },
        );
        throw new HttpException(
          Request_Was_Successful1,
          Request_Was_Successful1.status_code,
        );
      } else {
        throw new HttpException(DataNotFound, DataNotFound.status_code);
      }
    } catch (error) {
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else throw error;
    }
  }
}
