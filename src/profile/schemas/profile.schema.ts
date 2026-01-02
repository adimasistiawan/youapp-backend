import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProfileDocument = Profile & Document;

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Schema({ timestamps: true })
export class Profile {
  @Prop({ type: Types.ObjectId, ref: 'User', unique: true })
  userId: Types.ObjectId;

  @Prop()
  image: string;

  @Prop({ required: true })
  name: string;

  @Prop({ enum: Gender })
  gender: Gender;

  @Prop({ required: true })
  birthday: Date;

  @Prop()
  horoscope: string;

  @Prop()
  zodiac: string;

  @Prop()
  weight: number;

  @Prop()
  height: number;

  @Prop({ type: [String], default: [] })
  interest: string[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
