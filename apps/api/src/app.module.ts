import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { BookmarksModule } from "./bookmarks/bookmarks.module";
import { ContentModule } from "./content/content.module";
import { PrismaService } from "./database/prisma.service";
import { HealthController } from "./health.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    ContentModule,
    BookmarksModule
  ],
  controllers: [HealthController],
  providers: [PrismaService]
})
export class AppModule {}
