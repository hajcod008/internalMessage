import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Get,
  Delete,
  Put,
} from '@nestjs/common';
import {
  AddAndSendMessageDto,
  AddAndSendMessageResponseDto,
} from './dto/send-message.dto';
import { sendMessageAll } from './messageAll/messageForAll';
import { MessageService } from './message.service';
import { CheckTokenGuard } from 'src/common/guard/check-token.guard';
import { sendAndsaveMessage } from './messageOnePerson/messageOnePerson';
import { sendMessageMany } from './messageForMany/send-messageForMany';
import { deleteMessage } from './deleteMessage/deleteMessage';
import { updateMessage } from './updateMessage/updateMessage';

@Controller('api/message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly messageAll: sendMessageAll,
    private readonly sendmessage: sendAndsaveMessage,
    private readonly sendmessageMany: sendMessageMany,
    private readonly deleteMessages: deleteMessage,
    private readonly updateMessages: updateMessage,
  ) {}

  @UseGuards(CheckTokenGuard)
  @Post('send-message-all')
  async sendMessageAll(
    @Body() sendMessage: AddAndSendMessageDto,
  ): Promise<AddAndSendMessageResponseDto> {
    const result = await this.messageAll.messageAll(sendMessage);
    return result as AddAndSendMessageResponseDto;
  }

  @UseGuards(CheckTokenGuard)
  @Post('send-message/:userId')
  async sendMessage(
    @Param('userId') userId,
    @Body() sendMessage: AddAndSendMessageDto,
  ): Promise<AddAndSendMessageResponseDto> {
    const result = await this.sendmessage.sendMessage(sendMessage, userId);
    return result as AddAndSendMessageResponseDto;
  }

  @UseGuards(CheckTokenGuard)
  @Post('send-message-Many/:userId')
  async sendMessageMany(
    @Param('userId') userId,
    @Body() sendMessagemany: AddAndSendMessageDto,
  ): Promise<AddAndSendMessageResponseDto> {
    const result = await this.sendmessageMany.messageForMany(
      sendMessagemany,
      userId,
    );
    return result as AddAndSendMessageResponseDto;
  }

  @UseGuards(CheckTokenGuard)
  @Get('get-message/:userId')
  async getMessagge(
    @Param('userId') userId: any,
  ): Promise<AddAndSendMessageResponseDto> {
    const result = await this.messageService.getUserMessages(userId);
    return result as AddAndSendMessageResponseDto;
  }

  @UseGuards(CheckTokenGuard)
  @Delete('delete-message/:messageId')
  async deleteMessage(
    @Param('messageId') messageId: any,
  ): Promise<AddAndSendMessageResponseDto> {
    const result = await this.deleteMessages.messageDelete(messageId);
    return result as AddAndSendMessageResponseDto;
  }

  @UseGuards(CheckTokenGuard)
  @Put('update-message/:messageId/')
  async updateMessage(
    @Param('messageId') messageId: any,

    @Body() updateMessagess: AddAndSendMessageDto,
  ): Promise<AddAndSendMessageResponseDto> {
    const result = await this.updateMessages.messageUpdate(
      updateMessagess,
      messageId,
    );
    return result as AddAndSendMessageResponseDto;
  }
}
