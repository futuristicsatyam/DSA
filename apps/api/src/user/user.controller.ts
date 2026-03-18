// apps/api/src/user/user.controller.ts

import {
  Controller, Get, Patch, Post, Delete,
  Body, Param, Req, UseGuards,
} from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth, ApiOperation, ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from "@nestjs/passport";
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ── Dashboard ───────────────────────────────────────────────────────────────
  @Get('dashboard')
  @ApiOperation({ summary: 'Get user dashboard data' })
  async getDashboard(@Req() req: any) {
    return this.userService.getDashboard(req.user.id).then(d => d.progressSummary);
  }

  // ── Profile ─────────────────────────────────────────────────────────────────
  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile (name)' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.id, dto);
  }

  // ── Change password ─────────────────────────────────────────────────────────
  @Patch('password')
  @ApiOperation({ summary: 'Change account password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Current password is incorrect' })
  async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.id, dto);
  }

  // ── Bookmarks ───────────────────────────────────────────────────────────────
  @Get('bookmarks')
  @ApiOperation({ summary: 'Get all user bookmarks' })
  async getBookmarks(@Req() req: any) {
    return this.userService.getBookmarks(req.user.id);
  }

  @Post('bookmarks')
  @ApiOperation({ summary: 'Add a bookmark' })
  async addBookmark(
    @Req() req: any,
    @Body() body: { topicId?: string; editorialId?: string },
  ) {
    return this.userService.addBookmark(
      req.user.id,
      body.topicId,
      body.editorialId,
    );
  }

  @Delete('bookmarks/:id')
  @ApiOperation({ summary: 'Remove a bookmark' })
  async removeBookmark(@Req() req: any, @Param('id') id: string) {
    return this.userService.removeBookmark(req.user.id, id);
  }

  // ── Progress ────────────────────────────────────────────────────────────────
  @Get('progress')
  @ApiOperation({ summary: 'Get user progress' })
  async getProgress(@Req() req: any) {
    return this.userService.getDashboard(req.user.id).then(d => d.progressSummary);
  }

  // ── Recently viewed ─────────────────────────────────────────────────────────
  @Get('recently-viewed')
  @ApiOperation({ summary: 'Get recently viewed topics' })
  async getRecentlyViewed(@Req() req: any) {
    return this.userService.getDashboard(req.user.id).then(d => d.recentlyViewed);
  }
}
