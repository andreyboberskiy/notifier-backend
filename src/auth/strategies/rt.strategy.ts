import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import config from 'config/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.auth.refreshSecret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload) {
    const refreshToken = req.get('authorization').split('Bearer ')[1];
    return { ...payload, refreshToken };
  }
}
