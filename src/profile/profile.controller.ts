import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dto/profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { profileImageStorage } from './multer.config';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post('createProfile')
  @ApiOperation({
    summary: 'Create user profile',
    description: 'Create profile with image upload and auto-calculated horoscope & zodiac',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        name: { type: 'string', example: 'John' },
        gender: { type: 'string', example: 'male' },
        birthday: { type: 'string', example: '1997-02-07' },
        weight: { type: 'number', example: 70 },
        height: { type: 'number', example: 170 },
        interest: {
          type: 'array',
          items: { type: 'string' },
          example: ['coding', 'music'],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Profile created successfully',
    schema: {
      example: {
        message: 'Profile created successfully',
        data: {
            "userId": "6957b26c023702e260806c3d",
            "image": "/uploads/profiles/3f9dbc45-48df-4e20-9472-568b44596f59.png",
            "name": "John",
            "gender": "male",
            "birthday": "1998-02-10T00:00:00.000Z",
            "horoscope": "Aquarius",
            "zodiac": "Tiger",
            "weight": 75,
            "height": 176,
            "interest": [
                "coding",
                "music"
            ],
            "_id": "6957edacb6e5a12e62c18012",
            "createdAt": "2026-01-02T16:09:16.740Z",
            "updatedAt": "2026-01-02T16:09:16.740Z",
            "__v": 0
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: profileImageStorage,
      fileFilter: (_, file, cb) => {
        if (!file.mimetype.startsWith('image')) {
          cb(new Error('Only image files allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  create(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: ProfileDto,
  ) {
    const imagePath = file ? `/uploads/profiles/${file.filename}` : undefined;
    return this.profileService.create(req.user.sub, dto, imagePath);
  }

  @Get('getProfile')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieve logged-in user profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Get profile successfully',
    schema: {
      example: {
        message: 'Get profile successfully',
        data: {
            "_id": "6957edacb6e5a12e62c18012",
            "userId": "6957b26c023702e260806c3d",
            "image": "/uploads/profiles/c8918d5b-5557-4e59-9e4b-9753b8a0ada6.png",
            "name": "Adimas",
            "gender": "male",
            "birthday": "1999-07-12T00:00:00.000Z",
            "horoscope": "Cancer",
            "zodiac": "Rabbit",
            "weight": 75,
            "height": 176,
            "interest": [
                "test"
            ],
            "createdAt": "2026-01-02T16:09:16.740Z",
            "updatedAt": "2026-01-04T06:10:33.733Z",
            "__v": 0,
            "imageUrl": "http://localhost:3000/uploads/profiles/c8918d5b-5557-4e59-9e4b-9753b8a0ada6.png"
        },
      },
    },
  })
  async get(@Req() req) {
    const result = await this.profileService.get(req.user.sub);
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    return {
      message: result.message,
      data: {
        ...result.data.toObject(),
        imageUrl: result.data.image
          ? `${baseUrl}${result.data.image}`
          : null,
      },
    };
  }

  @Put('updateProfile')
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Update profile data and optionally replace image',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        name: { type: 'string', example: 'John' },
        gender: { type: 'string', example: 'male' },
        birthday: { type: 'string', example: '1997-02-07' },
        weight: { type: 'number', example: 70 },
        height: { type: 'number', example: 170 },
        interest: {
          type: 'array',
          items: { type: 'string' },
          example: ['coding', 'music'],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    schema: {
      example: {
        message: 'Profile updated successfully',
        data: {
            "userId": "6957b26c023702e260806c3d",
            "image": "/uploads/profiles/3f9dbc45-48df-4e20-9472-568b44596f59.png",
            "name": "John",
            "gender": "male",
            "birthday": "1998-02-10T00:00:00.000Z",
            "horoscope": "Aquarius",
            "zodiac": "Tiger",
            "weight": 75,
            "height": 176,
            "interest": [
                "coding",
                "music"
            ],
            "_id": "6957edacb6e5a12e62c18012",
            "createdAt": "2026-01-02T16:09:16.740Z",
            "updatedAt": "2026-01-02T16:09:16.740Z",
            "__v": 0
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: profileImageStorage,
    }),
  )
  update(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: ProfileDto,
  ) {
    const imagePath = file ? `/uploads/profiles/${file.filename}` : undefined;
    return this.profileService.update(req.user.sub, dto, imagePath);
  }
}
