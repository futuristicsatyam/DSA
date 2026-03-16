import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";

import { OtpType, Prisma, Role, User } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { PrismaService } from "../database/prisma.service";
import { compareHash, hashValue } from "../common/utils/hash";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, USER_ROLE_COOKIE } from "../common/constants";
import { MailService } from "../notifications/mail.service";
import { SmsService } from "../notifications/sms.service";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { OtpService } from "./otp.service";
import { JwtPayload } from "./interfaces/jwt-payload.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private readonly smsService: SmsService
  ) {}

  private isEmail(identifier: string) {
    return identifier.includes("@");
  }

  private async generateTokens(user: Pick<User, "id" | "email" | "phone" | "role">) {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    phone: user.phone,
    role: user.role
  };

  const accessExpiresIn = this.configService.getOrThrow<string>("JWT_ACCESS_TTL") as any;
  const refreshExpiresIn = this.configService.getOrThrow<string>("JWT_REFRESH_TTL") as any;

  const accessToken = await this.jwtService.signAsync(payload, {
    secret: this.configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
    expiresIn: accessExpiresIn
  });

  const refreshToken = await this.jwtService.signAsync(payload, {
    secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
    expiresIn: refreshExpiresIn
  });

  return { accessToken, refreshToken };
}

private getCookieOptions(httpOnly: boolean, maxAge: number) {
  const cookieDomain = this.configService.get<string>("COOKIE_DOMAIN");
  const sameSiteRaw = this.configService.get<string>("COOKIE_SAME_SITE");

  const sameSite =
    sameSiteRaw === "none" || sameSiteRaw === "strict" || sameSiteRaw === "lax"
      ? sameSiteRaw
      : "none";

  const normalizedDomain = cookieDomain?.trim();
  const shouldSetDomain = Boolean(normalizedDomain);

  return {
    httpOnly,
    sameSite,
    secure: true,
    ...(shouldSetDomain ? { domain: normalizedDomain } : {}),
    path: "/",
    maxAge
  } as const;
}

  private setAuthCookies(response: Response, accessToken: string, refreshToken: string, role: Role) {
    response.cookie(ACCESS_TOKEN_COOKIE, accessToken, this.getCookieOptions(true, 15 * 60 * 1000));

    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, this.getCookieOptions(true, 30 * 24 * 60 * 60 * 1000));

    response.cookie(USER_ROLE_COOKIE, role, this.getCookieOptions(false, 30 * 24 * 60 * 60 * 1000));
  }

  clearAuthCookies(response: Response) {
  const cookieDomain = this.configService.get<string>("COOKIE_DOMAIN");
  const normalizedDomain = cookieDomain?.trim();
  const shouldSetDomain = Boolean(normalizedDomain);

  for (const cookie of [ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, USER_ROLE_COOKIE]) {
    response.clearCookie(cookie, {
      ...(shouldSetDomain ? { domain: normalizedDomain } : {}),
      path: "/"
    });
  }
}

  async signup(dto: SignupDto, response: Response) {
  if (dto.password !== dto.confirmPassword) {
    throw new BadRequestException("Passwords do not match");
  }

  const existingUser = await this.prisma.user.findFirst({
    where: {
      OR: [{ email: dto.email }, { phone: dto.phoneNumber }]
    }
  });

  if (existingUser) {
    throw new BadRequestException("Email or phone number already registered");
  }

  let user: User;

  try {
    user = await this.prisma.user.create({
      data: {
        name: dto.fullName,
        email: dto.email,
        phone: dto.phoneNumber,
        passwordHash: await hashValue(dto.password)
      }
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictException("Email or phone number already exists");
    }

    throw error;
  }

  const { accessToken, refreshToken } = await this.generateTokens(user);

  await this.prisma.user.update({
    where: { id: user.id },
    data: { refreshTokenHash: await hashValue(refreshToken) }
  });

  this.setAuthCookies(response, accessToken, refreshToken, user.role);

  await this.sendEmailOtp({ target: dto.email, type: OtpType.EMAIL_VERIFY }, user.id);
  await this.sendPhoneOtp({ target: dto.phoneNumber, type: OtpType.PHONE_VERIFY }, user.id);

  return {
    message: "Signup successful",
    data: {
      user: await this.safeUser(user.id)
    }
  };
}

  async login(dto: LoginDto, response: Response) {
    const where = this.isEmail(dto.identifier) ? { email: dto.identifier } : { phone: dto.identifier };
    const user = await this.prisma.user.findUnique({ where });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordMatches = await compareHash(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: await hashValue(refreshToken) }
    });

    this.setAuthCookies(response, accessToken, refreshToken, user.role);

    return {
      message: "Login successful",
      data: {
        user: await this.safeUser(user.id)
      }
    };
  }

  async refresh(userId: string, refreshToken: string, response: Response) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new ForbiddenException("Access denied");
    }

    const valid = await compareHash(refreshToken, user.refreshTokenHash);
    if (!valid) {
      throw new ForbiddenException("Access denied");
    }

    const tokens = await this.generateTokens(user);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: await hashValue(tokens.refreshToken) }
    });

    this.setAuthCookies(response, tokens.accessToken, tokens.refreshToken, user.role);

    return {
      message: "Session refreshed",
      data: {
        user: await this.safeUser(user.id)
      }
    };
  }

  async logout(userId: string, response: Response) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null }
    });

    this.clearAuthCookies(response);

    return {
      message: "Logged out successfully",
      data: null
    };
  }

  async me(userId: string) {
    return {
      message: "Current user fetched",
      data: {
        user: await this.safeUser(userId)
      }
    };
  }

  async sendEmailOtp(
    payload: {
      target: string;
      type: OtpType;
    },
    userId?: string
  ) {
    const otp = await this.otpService.createOtp(payload.target, payload.type, userId);
    await this.mailService.sendOtpEmail(payload.target, otp.code, payload.type);

    return {
      message: "Email OTP sent",
      data: null
    };
  }

  async verifyEmailOtp(target: string, code: string) {
    await this.otpService.verifyOtp(target, OtpType.EMAIL_VERIFY, code);

    await this.prisma.user.updateMany({
      where: { email: target },
      data: { emailVerified: true }
    });

    return {
      message: "Email verified successfully",
      data: null
    };
  }

  async sendPhoneOtp(
    payload: {
      target: string;
      type: OtpType;
    },
    userId?: string
  ) {
    const otp = await this.otpService.createOtp(payload.target, payload.type, userId);
    await this.smsService.sendOtpSms(payload.target, otp.code, payload.type);

    return {
      message: "Phone OTP sent",
      data: null
    };
  }

  async verifyPhoneOtp(target: string, code: string) {
    await this.otpService.verifyOtp(target, OtpType.PHONE_VERIFY, code);

    await this.prisma.user.updateMany({
      where: { phone: target },
      data: { phoneVerified: true }
    });

    return {
      message: "Phone verified successfully",
      data: null
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const where = this.isEmail(dto.target) ? { email: dto.target } : { phone: dto.target };
    const user = await this.prisma.user.findUnique({ where });

    if (!user) {
      throw new BadRequestException("No account found for the provided identifier");
    }

    if (this.isEmail(dto.target)) {
      await this.sendEmailOtp({ target: dto.target, type: OtpType.RESET_PASSWORD }, user.id);
    } else {
      const otp = await this.otpService.createOtp(dto.target, OtpType.RESET_PASSWORD, user.id);
      await this.smsService.sendOtpSms(dto.target, otp.code, OtpType.RESET_PASSWORD);
    }

    return {
      message: "Password reset OTP sent",
      data: null
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const otp = await this.otpService.verifyOtp(dto.target, OtpType.RESET_PASSWORD, dto.code);

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.target }, { phone: dto.target }]
      }
    });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashValue(dto.newPassword),
        refreshTokenHash: null
      }
    });

    return {
      message: "Password reset successful",
      data: null
    };
  }

  private async safeUser(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        emailVerified: true,
        phoneVerified: true,
        role: true,
        createdAt: true
      }
    });

    return user;
  }
}
