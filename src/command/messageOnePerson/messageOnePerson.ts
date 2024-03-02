import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MessageEntity } from "../entities/message.entity";
import { Connection, Repository } from "typeorm";
import { mapMessageEntity } from "../entities/map-message.entity";
import { MessageService } from "../message.service";
import { Request_Was_Successful1 } from "src/common/translate/success.translate";
import { SYSTEM } from "../entities/systemName.entity";
import { Unauthorized } from "src/common/translate/errors.translate";

@Injectable()
export class sendAndsaveMessage {
    constructor(
        @InjectRepository(MessageEntity)
        private readonly messageRepository:Repository<MessageEntity>,
        @InjectRepository(mapMessageEntity)
        private readonly mapMessageRepository:Repository<mapMessageEntity>,
        @InjectRepository(SYSTEM)
        private readonly systemRepository:Repository<SYSTEM>,
        private readonly connection: Connection,
        private readonly messageService: MessageService,

    ){}

    async sendMessage(AddAndSendMessageDto:any,userId:any,):Promise<any>{
        const {message_text, Title, mobile_number,system}= AddAndSendMessageDto;
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
            message.mobile_number = mobile_number;
            await queryRunner.manager.save(message);
            var messageId = message.id;
            console.log(message);


            let mapM = new mapMessageEntity();
            mapM.message_id = messageId;
            mapM.user_id= userId;
            mapM.system_name = system;
            await queryRunner.manager.save(mapM);
            await queryRunner.commitTransaction();
        } catch (error) {
              await queryRunner.rollbackTransaction();
        }finally {
            await queryRunner.release();
        }
        throw new HttpException(
            Request_Was_Successful1,
            Request_Was_Successful1.status_code,
          );
          
    }
}