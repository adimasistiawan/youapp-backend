import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { getModelToken } from '@nestjs/mongoose';
import { Gender } from './schemas/profile.schema';

describe('ProfileService', () => {
  let service: ProfileService;
  let model: any;

  beforeEach(async () => {
    model = {
      create: jest.fn(),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: getModelToken('Profile'), useValue: model },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should create profile with horoscope and zodiac', async () => {
    model.create.mockResolvedValue({
      name: 'Test',
      horoscope: 'Aquarius',
      zodiac: 'Tiger',
    });

    const result = await service.create('user1', {
      name: 'Test',
      gender: Gender.MALE,
      birthday: '1998-02-10',
    });

    expect(result.data.horoscope).toBe('Aquarius');
    expect(result.data.zodiac).toBe('Tiger');
  });

  it('should throw if profile not found', async () => {
    model.findOne.mockResolvedValue(null);

    await expect(service.get('user1')).rejects.toThrow();
  });
});
