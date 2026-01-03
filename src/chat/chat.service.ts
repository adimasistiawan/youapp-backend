import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(private rabbitService: RabbitMQService) {}

  async sendMessage(senderId: string, dto: SendMessageDto) {
    const payload = {
      senderId,
      receiverId: dto.receiverId,
      content: dto.content,
      timestamp: new Date(),
    };

    await this.rabbitService.publish(payload);

    return {
      message: 'Message sent to queue',
    };
  }
}
