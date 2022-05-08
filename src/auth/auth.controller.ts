import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'auth/auth.service';
import { GetUser, Public } from 'auth/decorators';
import { SignInDto, SignUpDto } from 'auth/dto';
import { Tokens } from 'auth/types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body(ValidationPipe) signUpDto: SignUpDto): Promise<Tokens> {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Body(ValidationPipe) signInDto: SignInDto): Promise<Tokens> {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @GetUser('id') id: number,
    @GetUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(id, refreshToken);
  }
}
