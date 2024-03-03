import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { mapMessageEntity } from './entities/map-message.entity';
import { sendMessageAll } from './messageAll/messageForAll';
import { sendAndsaveMessage } from './messageOnePerson/messageOnePerson';
import { sendMessageMany } from './messageForMany/send-messageForMany';
import { deleteMessage } from './deleteMessage/deleteMessage';
import { updateMessage } from './updateMessage/updateMessage';
import { SYSTEM } from './entities/systemName.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, mapMessageEntity, SYSTEM]),
  ],
  controllers: [MessageController],
  providers: [
    MessageService,
    sendMessageAll,
    sendAndsaveMessage,
    sendMessageMany,
    deleteMessage,
    updateMessage,
    
  ],
  exports: [MessageService],
})
export class MessageModule {}
