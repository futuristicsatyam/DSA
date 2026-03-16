import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { AdminService } from "./admin.service";
import { CreateEditorialDto } from "./dto/create-editorial.dto";
import { UpdateEditorialDto } from "./dto/update-editorial.dto";
import { AdminRoleGuard } from "./guards/admin-role.guard";

@ApiTags("Admin")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"), AdminRoleGuard)
@Controller("api/v1/admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("stats")
  getStats() {
    return this.adminService.getStats();
  }

  @Get("editorials")
  getAllEditorials() {
    return this.adminService.getAllEditorials();
  }

  @Get("editorials/:id")
  getEditorialById(@Param("id") id: string) {
    return this.adminService.getEditorialById(id);
  }

  @Post("editorials")
  createEditorial(@Body() dto: CreateEditorialDto) {
    return this.adminService.createEditorial(dto);
  }

  @Patch("editorials/:id")
  updateEditorial(@Param("id") id: string, @Body() dto: UpdateEditorialDto) {
    return this.adminService.updateEditorial(id, dto);
  }

  @Patch("editorials/:id/publish")
  publishEditorial(@Param("id") id: string) {
    return this.adminService.publishEditorial(id);
  }

  @Patch("editorials/:id/unpublish")
  unpublishEditorial(@Param("id") id: string) {
    return this.adminService.unpublishEditorial(id);
  }

  @Delete("editorials/:id")
  deleteEditorial(@Param("id") id: string) {
    return this.adminService.deleteEditorial(id);
  }
}
