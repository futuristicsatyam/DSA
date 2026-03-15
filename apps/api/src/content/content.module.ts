import { Module } from "@nestjs/common";
import { CacheModule } from "../cache/cache.module";
import { DatabaseModule } from "../database/database.module";
import { ContentController } from "./content.controller";
import { ContentService } from "./content.service";

@Module({
  imports: [DatabaseModule, CacheModule],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService]
})
export class ContentModule {}
