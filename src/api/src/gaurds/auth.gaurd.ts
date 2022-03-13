import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';

interface JWTPayload {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // determine the user types that can execute a given endpoint
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    // get JWT from the request header & assert it is valid (only if there are roles in the roles arr)
    if (roles?.length) {
      const request = context.switchToHttp().getRequest();
      const token = request.headers?.authorization?.split('Bearer ')[1];
      try {
        const payload = (await jwt.verify(
          token,
          process.env.JWT_SECRET,
        )) as JWTPayload;

        // make DB request to get the user
        const user = await this.prismaService.user.findUnique({
          where: { id: payload.id },
        });

        if (!user) {
          return false;
        }

        // determine what permissions the user has (ADMIN, REGULAR)
        // [UserType.Admin, UserType.REGULAR].includes(UserType.)
        if (roles.includes(user.user_type)) {
          return true;
        }
        return false;
      } catch (e) {
        // jwt is not valid
        return false;
      }
    }
    // if no roles, you don't need to be authenticated to execute this endpoint
    return true;
  }
}
