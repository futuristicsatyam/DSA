import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly client: any | null;

  constructor(private readonly configService: ConfigService) {
    const sid = this.configService.get<string>("sms.accountSid");
    const token = this.configService.get<string>("sms.authToken");

    if (!sid || !token) {
      this.client = null;
      return;
    }

    try {
      // Load Twilio only when credentials are actually present
      // so the app can boot even if SMS is not configured yet.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Twilio = require("twilio");
      this.client = Twilio(sid, token);
    } catch {
      this.client = null;
      this.logger.warn("Twilio package not installed. SMS sending is disabled.");
    }
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
