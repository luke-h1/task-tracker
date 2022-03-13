import * as bcrypt from 'bcryptjs';
import {
  Body,
  Controller,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from '../dtos/SignupDto';
import { UserType } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  async signup(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    // user is becoming an admin & has an accessKey from an admin user
    if (userType !== UserType.DEFAULT && body.accessKey) {
      const validAccessKey = `${body.email}-${userType}-${process.env.ACCESS_KEY_SECRET}`;

      const isValidAccessKey = await bcrypt.compare(
        validAccessKey,
        body.accessKey,
      );
      if (!isValidAccessKey) {
        throw new UnauthorizedException();
      }
    }
    return this.authService.signup(body, userType);
  }
}
