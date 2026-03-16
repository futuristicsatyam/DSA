import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { ContentModule } from "../content/content.module";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { AdminRoleGuard } from "./guards/admin-role.guard";

@Module({
  imports: [DatabaseModule, ContentModule],
  controllers: [AdminController],
  providers: [AdminService, AdminRoleGuard]
})
export class AdminModule {}
