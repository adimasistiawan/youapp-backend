import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Gender } from '../schemas/profile.schema';
import { Type } from 'class-transformer';

export class ProfileDto {
  @IsOptional()
  @IsString()
  image?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsDateString()
  birthday: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  weight?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  height?: number;

  @IsOptional()
  @IsArray()
  interest?: string[];
}
