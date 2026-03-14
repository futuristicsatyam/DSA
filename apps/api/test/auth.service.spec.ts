import { Test } from "@nestjs/testing";
import { AuthService } from "../src/auth/auth.service";
import { PrismaService } from "../src/database/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { OtpService } from "../src/auth/otp.service";
import { MailService } from "../src/notifications/mail.service";
import { SmsService } from "../src/notifications/sms.service";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {}
        },
        {
          provide: JwtService,
          useValue: {}
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
            getOrThrow: jest.fn()
          }
        },
        {
          provide: OtpService,
          useValue: {}
        },
        {
          provide: MailService,
          useValue: {}
        },
        {
          provide: SmsService,
          useValue: {}
        }
      ]
    }).compile();

    service = moduleRef.get(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
