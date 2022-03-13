import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserInfo {
  firstName: string;
  id: number;
  iat: number;
  exp: number;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
