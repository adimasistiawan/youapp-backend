import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { email, username, password, confirmPassword } = dto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    if (await this.usersService.findByEmail(email)) {
      throw new BadRequestException('Email already registered');
    }

    if (await this.usersService.findByUsername(username)) {
      throw new BadRequestException('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersService.create({
      email,
      username,
      password: hashedPassword,
    });

    return {
      message: 'User registered successfully',
    };
  }

  async login(dto: LoginDto) {
    const { identifier, password } = dto;

    const user =
      (await this.usersService.findByEmail(identifier)) ||
      (await this.usersService.findByUsername(identifier));

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user._id,
      username: user.username,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
