// apps/api/src/user/user.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';

// ── Inline DTOs (matching your controller imports) ────────────────────────────
// These match the DTO classes in ./dto/update-profile.dto.ts
// and ./dto/change-password.dto.ts that your controller already imports

interface UpdateProfileDto {
  name?: string;
}

interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Dashboard (your existing code — untouched) ────────────────────────────
  async getDashboard(userId: string) {
    const continueLearning = await this.prisma.userProgress.findMany({
      where: {
        userId,
        progressPercent: { gt: 0, lt: 100 },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: { topic: { include: { subject: true } } },
    });

    const recentlyViewed = await this.prisma.recentlyViewed.findMany({
      where: { userId },
      orderBy: { viewedAt: 'desc' },
      take: 5,
      include: { topic: { include: { subject: true } } },
    });

    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { topic: true, editorial: true },
    });

    const completedCount = await this.prisma.userProgress.count({
      where: { userId, completed: true },
    });

    const totalTopics = await this.prisma.topic.count();
    const percent =
      totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

    const recommendations = await this.prisma.topic.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { subject: true },
    });

    const now = new Date();
    const weeklyActivity = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - index));
      return { date: date.toISOString().slice(0, 10), count: 0 };
    });

    for (const item of recentlyViewed) {
      const day = item.viewedAt.toISOString().slice(0, 10);
      const found = weeklyActivity.find((entry) => entry.date === day);
      if (found) found.count += 1;
    }

    return {
      continueLearning,
      recentlyViewed,
      bookmarks,
      progressSummary: { completedCount, totalTopics, percent },
      streak: 0,
      weeklyActivity,
      recommendations,
    };
  }

  // ── Update profile ────────────────────────────────────────────────────────
  // Controller calls: this.userService.updateProfile(req.user.id, dto)
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (!dto.name || dto.name.trim().length < 2) {
      throw new BadRequestException('Name must be at least 2 characters');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { name: dto.name.trim() },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        emailVerified: true,
        phoneVerified: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // ── Change password ───────────────────────────────────────────────────────
  // Controller calls: this.userService.changePassword(req.user.id, dto)
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, passwordHash: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!valid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const newHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return { message: 'Password changed successfully' };
  }

  // ── Get all bookmarks ─────────────────────────────────────────────────────
  // Controller calls: this.userService.getBookmarks(req.user.id)
  async getBookmarks(userId: string) {
    return this.prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        topic: { include: { subject: true } },
        editorial: true,
      },
    });
  }

  // ── Add bookmark ──────────────────────────────────────────────────────────
  // Controller calls: this.userService.addBookmark(userId, topicId, editorialId)
  async addBookmark(
    userId: string,
    topicId?: string,
    editorialId?: string,
  ) {
    // Prevent duplicates
    if (topicId) {
      const existing = await this.prisma.bookmark.findFirst({
        where: { userId, topicId },
      });
      if (existing) return existing;
    }

    return this.prisma.bookmark.create({
      data: { userId, topicId, editorialId },
      include: {
        topic: { include: { subject: true } },
      },
    });
  }

  // ── Remove bookmark ───────────────────────────────────────────────────────
  // Controller calls: this.userService.removeBookmark(userId, id)
  async removeBookmark(userId: string, bookmarkId: string) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: { id: bookmarkId, userId },
    });
    if (!bookmark) throw new NotFoundException('Bookmark not found');

    await this.prisma.bookmark.delete({ where: { id: bookmarkId } });
    return { message: 'Bookmark removed' };
  }
}
