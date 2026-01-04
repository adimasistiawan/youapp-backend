import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('fake-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should register a user successfully', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
    (usersService.findByUsername as jest.Mock).mockResolvedValue(null);
    (usersService.create as jest.Mock).mockResolvedValue({ _id: '1' });

    const result = await service.register({
      email: 'test01@mail.com',
      username: 'test01',
      password: 'Password1',
      confirmPassword: 'Password1',
    });

    expect(result.message).toBe('User registered successfully');
  });

  it('should fail if passwords do not match', async () => {
    await expect(
      service.register({
        email: 'test01@mail.com',
        username: 'test01',
        password: 'Password1',
        confirmPassword: 'Password2',
      }),
    ).rejects.toThrow();
  });

  it('should login successfully', async () => {
    const hashed = await bcrypt.hash('Password1', 10);
    (usersService.findByEmail as jest.Mock).mockResolvedValue({
      _id: '1',
      username: 'test01',
      password: hashed,
    });

    const result = await service.login({
      identifier: 'test01@mail.com',
      password: 'Password1',
    });

    expect(result.accessToken).toBeDefined();
  });
});
