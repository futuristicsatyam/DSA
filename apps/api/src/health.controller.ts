import { Controller, Get } from "@nestjs/common";

@Controller()
export class HealthController {
  @Get("api/v1/health")
  health() {
    return {
      ok: true,
      service: "dsa-platform-api"
    };
  }
}
