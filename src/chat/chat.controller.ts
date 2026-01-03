import { Body, Controller, Get, Post, Req, UseGuards, Query, NotFoundException, BadRequestException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api')
export class ChatController {
  constructor(
    private chatService: ChatService,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  @Post('sendMessage')
  send(@Req() req, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(req.user.sub, dto);
  }

  @Get('viewMessages')
  async view(
    @Req() req,
    @Query('userId') userId: string,
  ) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid userId');
    }

    const userExists = await this.userModel.exists({ _id: userId });
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const messages = await this.messageModel.find({
        $or: [
            { senderId: req.user.sub, receiverId: userId },
            { senderId: userId, receiverId: req.user.sub },
        ],
    }).sort({ createdAt: 1 });

    if (!messages.length) {
        throw new NotFoundException('No messages found');
    }

    return messages;
  }
}
