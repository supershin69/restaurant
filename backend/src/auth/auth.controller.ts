import { Body, ConflictException, Controller, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { LoginDTO, RegisterDTO } from './auth.schema.js';
import type { Response } from 'express';
import { success } from 'zod';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() registerData: RegisterDTO) {
    try {
      const user = await this.authService.register(registerData);
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "User created successfully.",
        data: user
      }
    } catch(err) {
      if (err instanceof Error) {
        if (err.message === "Email already exists." || err.message === "Confirm password should be the same as password.") {
          throw new ConflictException(err.message);
        }

        if (err.message === "The branch doesn't exist.") {
          throw new NotFoundException(err.message);
        }
      }

      throw new InternalServerErrorException("Something went wrong while registering user. Please try again.")
    } 
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Body() loginData: LoginDTO, @Res({ passthrough: true }) res: Response) {
    try {
      const result = await this.authService.login(loginData);

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000
      })

      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Logged in successfully",
        token: result.token
      }

    } catch(err) {
      if (err instanceof Error) {
        if (err.message === "Incorrect email or password.") {
          throw new ConflictException(err.message);
        }
      }

      throw new InternalServerErrorException("Something went wrong while logging in. Please try again.");
    }
  }
}
