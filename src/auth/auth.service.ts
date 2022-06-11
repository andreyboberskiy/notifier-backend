import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import analytic from 'analytic';
import { SignInDto } from 'auth/dto/sign-in.dto';
import { Tokens } from 'auth/types';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from 'auth/dto/sign-up.dto';
import config from 'config/config';
import { Repository } from 'typeorm';
import { User } from 'user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async hashData(data): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  async getTokens(userId: number): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
        },
        { expiresIn: 60 * 60 * 24, secret: config.auth.accessSecret },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
        },
        { expiresIn: 60 * 60 * 24 * 7, secret: config.auth.refreshSecret },
      ),
    ]);

    return { accessToken: at, refreshToken: rt };
  }

  async updateRtHash(userId: number, refreshToken: string) {
    const hashedToken = await this.hashData(refreshToken);
    await this.userRepository.update({ id: userId }, { rtHash: hashedToken });
  }

  async signUp(signUpDto: SignUpDto): Promise<Tokens> {
    const { username, email, password } = signUpDto;

    const candidate = await this.userRepository.findOneBy([
      { email },
      { username },
    ]);

    if (candidate) {
      const message =
        candidate.username === username
          ? 'Username already exist'
          : 'User with this email already exist';
      throw new BadRequestException(message);
    }

    const hashedPassword = await this.hashData(password);

    const user = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    const tokens = await this.getTokens(user.id);
    await this.updateRtHash(user.id, tokens.refreshToken);

    analytic.send('Registered', user.id);

    return tokens;
  }

  async signIn(signInDto: SignInDto): Promise<Tokens> {
    const { login, password } = signInDto;

    const user = await this.userRepository.findOne({
      where: [{ email: login }, { username: login }],
      select: ['id', 'password', 'email', 'username'],
    });

    if (!user) {
      throw new BadRequestException('Credentials invalid');
    }
    const isPasswordRight = await bcrypt.compare(password, user.password);

    if (!isPasswordRight) {
      throw new BadRequestException('Credentials invalid');
    }

    const tokens = await this.getTokens(user.id);
    await this.updateRtHash(user.id, tokens.refreshToken);

    analytic.send('Login', user.id);

    return tokens;
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['rtHash'],
    });

    if (!user) throw new ForbiddenException('Access denied');

    const match = await bcrypt.compare(refreshToken, user.rtHash);

    if (!match) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(userId);
    await this.updateRtHash(userId, tokens.refreshToken);

    return { accessToken: 'keka', refreshToken: 'keka' };
  }
}
