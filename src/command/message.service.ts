import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { Repository } from 'typeorm';
import { mapMessageEntity } from './entities/map-message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(mapMessageEntity)
    private readonly mapMessageRepository: Repository<mapMessageEntity>,
  ) {}

  async getUserMessages(userId: string): Promise<any> {
    const result = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndMapMany(
        'message.maps',
        mapMessageEntity,
        'map_message',
        'map_message.message_id = message.id AND message.is_deleted = false',
      )
      .select(['message', 'map_message.user_id'])
      .where(
        'map_message.user_id = :userId OR map_message.user_id =:wildcardUserId AND map_message.is_deleted = false',
        { userId, wildcardUserId: '*' },
      )
      .getMany();

    return result.map((message) => {
      return {
        maps: message.maps.map((mapMessage) => ({
          userId: mapMessage.user_id,
          message,
        })),
      };
    });
  }


  async updateMessageReadStatus(id: any): Promise<void> {
    try {
      const message = await this.mapMessageRepository.findOne({
        where: {
          id: id,
          is_read: false,
        },
      });
      if (message && !message.is_read) {
        message.is_read = true;
        await message.save();
      } else {
        console.log('Message already read ');
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update message read status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
