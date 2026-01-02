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
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { profileImageStorage } from './multer.config';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post('createProfile')
  @ApiConsumes('multipart/form-data')
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
  @ApiConsumes('multipart/form-data')
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
