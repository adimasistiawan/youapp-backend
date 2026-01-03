import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';
import { MessageConsumer } from './message.consumer';
import { ChatGateway } from './socket/chat.gateway';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
    ]),
    UsersModule
  ],
  providers: [
    ChatService,
    RabbitMQService,
    MessageConsumer,
    ChatGateway,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
