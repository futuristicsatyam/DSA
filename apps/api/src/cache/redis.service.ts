import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis | null;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>("redis.url");
    this.client = url ? new Redis(url, { maxRetriesPerRequest: 1, enableReadyCheck: true }) : null;

    this.client?.on("error", (error) => {
      this.logger.warn(`Redis unavailable: ${error.message}`);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) return null;
    const value = await this.client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async set(key: string, value: unknown, ttlSeconds = 300) {
    if (!this.client) return;
    await this.client.set(key, JSON.stringify(value), "EX", ttlSeconds);
  }

  async del(key: string) {
    if (!this.client) return;
    await this.client.del(key);
  }
}
