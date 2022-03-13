import * as bcrypt from 'bcryptjs';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, SigninDto, GenerateAccessKeyDto } from '../dtos/SignupDto';
import { UserType } from '@prisma/client';
import { User, UserInfo } from '../decorators/user.decorator';

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
      console.log(isValidAccessKey);
      if (!isValidAccessKey) {
        throw new UnauthorizedException();
      }
    }
    return this.authService.signup(body, userType);
  }

  @Post('/signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  // allow admin to generate access key
  @Post('access-key')
  generateAccessKey(@Body() { email, userType }: GenerateAccessKeyDto) {
    return this.authService.generateAccessKey(email, userType);
  }

  @Get('/me')
  me(@User() user: UserInfo) {
    return user;
  }
}
