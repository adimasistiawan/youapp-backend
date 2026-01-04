import { Body, Controller, Get, Post, Req, UseGuards, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('sendMessage')
  send(@Req() req, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(req.user.sub, dto);
  }

  @Get('viewMessages')
  view(
    @Req() req,
    @Query('userId') userId: string,
  ) {
    return this.chatService.viewMessages(req.user.sub, userId);
  }
}
