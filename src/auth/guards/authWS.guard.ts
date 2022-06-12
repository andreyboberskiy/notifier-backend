import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtPayload } from 'auth/types';
import config from 'config/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthWSGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();

    const authToken =
      client.handshake.headers.authorization?.split('Bearer ')[1];
    if (authToken) {
      const jwtPayload: JwtPayload = <JwtPayload>(
        jwt.verify(authToken, config.auth.accessSecret)
      );
      const user = { id: jwtPayload.id };
      if (jwtPayload.id) {
        context.switchToWs().getData().user = user;
        return true;
      }
    }
    client.disconnect();
    return false;
  }
}
