import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { ChatGateway } from './socket/chat.gateway';

@Injectable()
export class MessageConsumer implements OnModuleInit {
  constructor(
    private rabbitService: RabbitMQService,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    private gateway: ChatGateway,
  ) {}

  async onModuleInit() {
    await this.rabbitService.consume(async (data) => {
      const message = await this.messageModel.create(data);

      this.gateway.notifyUser(data.receiverId, message);
    });
  }
}
