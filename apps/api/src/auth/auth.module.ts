import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DatabaseModule } from "../database/database.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AccessTokenStrategy } from "./strategies/access-token.strategy";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";
import { OtpService } from "./otp.service";
import { MailService } from "../notifications/mail.service";
import { SmsService } from "../notifications/sms.service";

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow("JWT_ACCESS_SECRET")
      })
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    OtpService,
    MailService,
    SmsService
  ],
  exports: [AuthService]
})
export class AuthModule {}
