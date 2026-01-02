import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { ProfileDto } from './dto/profile.dto';
import { calculateHoroscope } from './utils/horoscope.util';
import { calculateZodiac } from './utils/zodiac.util';
import { deleteFile } from './multer.config';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private profileModel: Model<ProfileDocument>,
  ) {}

  async create(userId: string, dto: ProfileDto, image?: string) {
    const birthday = new Date(dto.birthday);
    const profile = await this.profileModel.create({
        ...dto,
        image,
        userId,
        birthday,
        horoscope: calculateHoroscope(birthday),
        zodiac: calculateZodiac(birthday),
    });
    return {
      message: 'Profile created successfully',
      data: profile,
    };
  }

  async get(userId: string) {
    const profile = await this.profileModel.findOne({ userId });
    if (!profile) throw new NotFoundException('Profile not found');
    
    return {
      message: 'Get profile successfully',
      data: profile,
    };
  }

  async update(userId: string, dto: ProfileDto, image?: string) {
    const existingProfile = await this.profileModel.findOne({ userId });

    if (!existingProfile) {
        throw new NotFoundException('Profile not found');
    }

    if (image && existingProfile.image) {
        deleteFile(existingProfile.image);
    }
    const birthday = new Date(dto.birthday);
    const profile = await this.profileModel.findOneAndUpdate(
        { userId },
        {
            ...dto,
            ...(image && { image }),
            birthday,
            horoscope: calculateHoroscope(birthday),
            zodiac: calculateZodiac(birthday),
        },
        { new: true },
    );
    return {
      message: 'Profile updated successfully',
      data: profile
    }
  }
}
