import { Test } from "@nestjs/testing";
import { ContentService } from "../src/content/content.service";
import { PrismaService } from "../src/database/prisma.service";
import { RedisService } from "../src/cache/redis.service";

describe("ContentService", () => {
  let service: ContentService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ContentService,
        {
          provide: PrismaService,
          useValue: {}
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn()
          }
        }
      ]
    }).compile();

    service = moduleRef.get(ContentService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
