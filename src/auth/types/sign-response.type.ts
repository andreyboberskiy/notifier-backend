import { Tokens } from 'auth/types/tokens.type';
import { User } from 'user/entity/user.entity';

export type SignResponse = {
  user: Pick<User, 'id' | 'email' | 'username'>;
  tokens: Tokens;
};
