import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtModule } from "@nestjs/jwt"
import { JWT_SECRET } from '../constants.js';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET || "MY_sEcREt",
      signOptions: {
        expiresIn: "12h"
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
