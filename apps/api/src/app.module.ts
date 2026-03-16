import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { BookmarksModule } from "./bookmarks/bookmarks.module";
import { ContentModule } from "./content/content.module";
import { DatabaseModule } from "./database/database.module";
import { HealthController } from "./health.controller";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DatabaseModule,
    AuthModule,
    ContentModule,
    BookmarksModule,
    UserModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
