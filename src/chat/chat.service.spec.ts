import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { getModelToken } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { User } from '../users/schemas/user.schema';

describe('ChatService', () => {
  let service: ChatService;

  const mockRabbitService = {
    publish: jest.fn(),
  };

  const mockMessageModel = {
    find: jest.fn(),
  };

  const mockUserModel = {
    exists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: RabbitMQService,
          useValue: mockRabbitService,
        },
        {
          provide: getModelToken(Message.name),
          useValue: mockMessageModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should publish message to queue', async () => {
    const dto = {
      receiverId: 'receiver-id',
      content: 'Hello',
    };

    await service.sendMessage('sender-id', dto as any);

    expect(mockRabbitService.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        senderId: 'sender-id',
        receiverId: dto.receiverId,
        content: dto.content,
      }),
    );
  });
});