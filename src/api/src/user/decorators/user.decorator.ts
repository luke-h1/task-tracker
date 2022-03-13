import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserInfo {
  firstName: string;
  id: number;
  iat: number;
  exp: number;
}

const User = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});
export default User;
