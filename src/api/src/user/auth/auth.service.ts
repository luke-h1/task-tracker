import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

interface SignupParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface SigninParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup(body: SignupParams, userType: UserType): Promise<string> {
    const exists = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (exists) {
      throw new ConflictException();
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        user_type: userType,
        password: hashedPassword,
      },
    });
    return this.generateJWT(user.firstName, user.id);
  }

  async signin(body: SigninParams): Promise<string> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }

    const valid = await bcrypt.compare(body.password, user.password);

    if (!valid) {
      throw new HttpException('Invalid credentials', 400);
    }
    return this.generateJWT(user.firstName, user.id);
  }

  // allow user to become admin (only admins can generate this)

  /**
   *   @param email (email of user)
   *   @param userType (admin)
   *   @returns hash
   * */
  generateAccessKey(email: string, userType: UserType) {
    const s = `${email}-${userType}-${process.env.ACCESS_KEY_SECRET}`;
    return bcrypt.hash(s, 10);
  }

  private generateJWT(name: string, id: number): string {
    return jwt.sign(
      {
        name,
        id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 3600,
      },
    );
  }
}
