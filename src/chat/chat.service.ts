import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { SendMessageDto } from './dto/send-message.dto';
import { Message, MessageDocument } from './schemas/message.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class ChatService {
  constructor(
    private rabbitService: RabbitMQService,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async sendMessage(senderId: string, dto: SendMessageDto) {
    const payload = {
      senderId,
      receiverId: dto.receiverId,
      content: dto.content,
      timestamp: new Date(),
    };

    await this.rabbitService.publish(payload);

    return { message: 'Message sent to queue' };
  }

  async viewMessages(currentUserId: string, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid userId');
    }

    const userExists = await this.userModel.exists({ _id: userId });
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const messages = await this.messageModel
      .find({
        $or: [
          { senderId: currentUserId, receiverId: userId },
          { senderId: userId, receiverId: currentUserId },
        ],
      })
      .sort({ createdAt: 1 });

    if (!messages.length) {
      throw new NotFoundException('No messages found');
    }

    return messages;
  }
}
