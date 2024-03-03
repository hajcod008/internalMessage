import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { Repository } from 'typeorm';
import { mapMessageEntity } from './entities/map-message.entity';
import { InternalServerError } from 'src/common/translate/errors.translate';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(mapMessageEntity)
    private readonly mapMessageRepository: Repository<mapMessageEntity>,
  ) {}

  async getUserMessages(userId: string, system: string): Promise<any> {
    try {
      const result = await this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndMapMany(
          'message.maps',
          mapMessageEntity,
          'map_message',
          'map_message.message_id = message.id AND message.is_deleted = false AND message.system_name = :system ',
        )
        .where(
          '(map_message.user_id = :userId OR map_message.user_id = :wildcardUserId) AND  map_message.is_deleted = false',
          { userId, wildcardUserId: '*', system },
        )
        .select(['message', 'map_message.user_id', 'message.system_name'])
        .getMany();

      return result.map((message) => {
        return {
          maps: message.maps.map((mapMessage) => ({
            userId: mapMessage.user_id,
            system: message.system_name,
            message,
          })),
        };
      });
    } catch (error) {
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else throw error;
    }
  }

  async getAllmessage(system: string): Promise<any> {
    try {
      const result = await this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndMapMany(
          'message.maps',
          mapMessageEntity,
          'map_message',
          'map_message.message_id = message.id AND message.is_deleted = false',
        )
        .where('message.system_name = :system', { system })
        .select(['message', 'map_message.user_id', 'message.system_name'])
        .getMany();

      return result.map((message) => {
        return {
          message: message,
        };
      });
    } catch (error) {
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else throw error;
    }
  }

  async seenMessage(messageId: any): Promise<any> {
    try {
      const message = await this.messageRepository.findOne({
        where: {
          id: messageId,
        },
      });
      if (message && !message.is_read) {
        message.is_read = true;
        await message.save();
      } else {
        console.log('Message already read ');
      }
      return message;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update message read status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
