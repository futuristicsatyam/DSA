import { ApiProperty } from "@nestjs/swagger";
import { OtpType } from "@prisma/client";
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber } from "class-validator";

export class SendEmailOtpDto {
  @ApiProperty()
  @IsEmail()
  target!: string;

  @ApiProperty({ enum: [OtpType.EMAIL_VERIFY, OtpType.RESET_PASSWORD] })
  @IsEnum(OtpType)
  type!: OtpType;
}

export class SendPhoneOtpDto {
  @ApiProperty()
  @IsPhoneNumber("IN")
  target!: string;

  @ApiProperty({ enum: [OtpType.PHONE_VERIFY] })
  @IsEnum(OtpType)
  type!: OtpType;
}

export class VerifyOtpDto {
  @ApiProperty()
  target!: string;

  @ApiProperty({ enum: OtpType })
  @IsEnum(OtpType)
  type!: OtpType;

  @ApiProperty()
  code!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  userId?: string;
}
