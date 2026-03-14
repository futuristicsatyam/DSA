import { BadRequestException, Injectable, TooManyRequestsException } from "@nestjs/common";
import { OtpType } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class OtpService {
  constructor(private readonly prisma: PrismaService) {}

  private generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createOtp(target: string, type: OtpType, userId?: string) {
    const recentCount = await this.prisma.otp.count({
      where: {
        target,
        type,
        createdAt: {
          gte: new Date(Date.now() - 15 * 60 * 1000)
        }
      }
    });

    if (recentCount >= 5) {
      throw new TooManyRequestsException("Too many OTP requests. Please try again later.");
    }

    await this.prisma.otp.updateMany({
      where: { target, type, verified: false },
      data: { verified: true }
    });

    const code = this.generateCode();

    const otp = await this.prisma.otp.create({
      data: {
        userId,
        target,
        type,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      }
    });

    return otp;
  }

  async verifyOtp(target: string, type: OtpType, code: string) {
    const otp = await this.prisma.otp.findFirst({
      where: {
        target,
        type,
        verified: false
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    if (!otp) {
      throw new BadRequestException("OTP not found");
    }

    if (otp.expiresAt < new Date()) {
      throw new BadRequestException("OTP expired");
    }

    if (otp.attempts >= 5) {
      throw new TooManyRequestsException("Maximum OTP attempts exceeded");
    }

    if (otp.code !== code) {
      await this.prisma.otp.update({
        where: { id: otp.id },
        data: { attempts: { increment: 1 } }
      });
      throw new BadRequestException("Invalid OTP");
    }

    await this.prisma.otp.update({
      where: { id: otp.id },
      data: { verified: true }
    });

    return otp;
  }
}
