import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { Public } from "../common/decorators/public.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { RefreshAuthGuard } from "../common/guards/refresh-auth.guard";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { SendEmailOtpDto, SendPhoneOtpDto, VerifyOtpDto } from "./dto/send-otp.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@ApiTags("Auth")
@Controller("api/v1/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("signup")
  signup(@Body() dto: SignupDto, @Res({ passthrough: true }) response: Response) {
    return this.authService.signup(dto, response);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(dto, response);
  }

  @Public()
  @Post("send-email-otp")
  sendEmailOtp(@Body() dto: SendEmailOtpDto) {
    return this.authService.sendEmailOtp(dto);
  }

  @Public()
  @Post("verify-email-otp")
  verifyEmailOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyEmailOtp(dto.target, dto.code);
  }

  @Public()
  @Post("send-phone-otp")
  sendPhoneOtp(@Body() dto: SendPhoneOtpDto) {
    return this.authService.sendPhoneOtp(dto);
  }

  @Public()
  @Post("verify-phone-otp")
  verifyPhoneOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyPhoneOtp(dto.target, dto.code);
  }

  @Public()
  @Post("forgot-password")
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post("reset-password")
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post("refresh")
  refresh(
    @CurrentUser() user: { sub: string; refreshToken: string },
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.refresh(user.sub, user.refreshToken, response);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  me(@CurrentUser() user: { sub: string }) {
    return this.authService.me(user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  @Post("logout")
  logout(@CurrentUser() user: { sub: string }, @Res({ passthrough: true }) response: Response) {
    return this.authService.logout(user.sub, response);
  }
}
