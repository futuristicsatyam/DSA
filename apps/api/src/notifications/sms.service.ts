import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Twilio from "twilio";

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly client: ReturnType<typeof Twilio> | null;

  constructor(private readonly configService: ConfigService) {
    const sid = this.configService.get<string>("sms.accountSid");
    const token = this.configService.get<string>("sms.authToken");
    this.client = sid && token ? Twilio(sid, token) : null;
  }

  async sendOtpSms(target: string, code: string, type: string) {
    if (!this.client) {
      this.logger.log(`DEV phone OTP to ${target} (${type}): ${code}`);
      return;
    }

    await this.client.messages.create({
      body: `Your ${type} OTP is ${code}. It expires in 10 minutes.`,
      from: this.configService.get<string>("sms.phoneNumber"),
      to: target
    });
  }
}
