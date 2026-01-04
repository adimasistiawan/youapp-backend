import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('sendMessage')
  @ApiOperation({
    summary: 'Send message',
    description: 'Send text message to another user. Message will be published to RabbitMQ for notification.',
  })
  @ApiBody({
    type: SendMessageDto,
    examples: {
      example: {
        summary: 'Send message payload',
        value: {
          receiverId: '64f8c3ab123456',
          message: 'Hello 👋',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
    schema: {
      example: {
        message: 'Message sent to queue',
      },
    },
  })
  send(@Req() req, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(req.user.sub, dto);
  }

  @Get('viewMessages')
  @ApiOperation({
    summary: 'View chat messages',
    description: 'Retrieve chat messages between authenticated user and another user',
  })
  @ApiQuery({
    name: 'userId',
    required: true,
    description: 'Other user ID',
    example: '64f8c3ab123456...',
  })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
    schema: {
      example: {
        message: 'Messages retrieved',
        data: [
          {
            id: '65a1c8...',
            senderId: '64f8c3...',
            receiverId: '64f8c4...',
            message: 'Hello 👋',
            createdAt: '2024-01-01T10:00:00.000Z',
          },
          {
            id: '65a1c9...',
            senderId: '64f8c4...',
            receiverId: '64f8c3...',
            message: 'Hi there!',
            createdAt: '2024-01-01T10:01:00.000Z',
          },
        ],
      },
    },
  })
  async view(
    @Req() req,
    @Query('userId') userId: string,
  ) {
    const messages = await this.chatService.viewMessages(req.user.sub, userId);
    return {
      message: 'Messages retrieved',
      data: messages,
    };
  }
}
