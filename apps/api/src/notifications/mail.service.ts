import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const nodemailer = require("nodemailer");

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: any | null;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>("mail.host");
    const user = this.configService.get<string>("mail.user");
    const pass = this.configService.get<string>("mail.pass");

    this.transporter =
      host && user && pass
        ? nodemailer.createTransport({
            host,
            port: this.configService.get<number>("mail.port"),
            secure: false,
            auth: { user, pass }
          })
        : null;
  }

  async sendOtpEmail(target: string, code: string, type: string) {
    if (!this.transporter) {
      this.logger.log(`DEV email OTP to ${target} (${type}): ${code}`);
      return;
    }

    await this.transporter.sendMail({
      from: this.configService.get<string>("mail.from"),
      to: target,
      subject: `Your ${type} OTP`,
      text: `Your one-time password is ${code}. It expires in 10 minutes.`
    });
  }
}
