// apps/api/src/user/user.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Dashboard (your existing code — untouched) ────────────────────────────
  async getDashboard(userId: string) {
    const continueLearning = await this.prisma.userProgress.findMany({
      where: { userId, progressPercent: { gt: 0, lt: 100 } },
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

  // ── Update profile name ───────────────────────────────────────────────────
  async updateProfile(userId: string, name: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { name },
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
    return user;
  }

  // ── Change password ───────────────────────────────────────────────────────
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, passwordHash: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return { message: 'Password changed successfully' };
  }

  // ── Get all bookmarks ─────────────────────────────────────────────────────
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
  async addBookmark(
    userId: string,
    topicId?: string,
    editorialId?: string,
  ) {
    // Prevent duplicates
    const existing = await this.prisma.bookmark.findFirst({
      where: { userId, topicId: topicId ?? null },
    });
    if (existing) return existing;

    return this.prisma.bookmark.create({
      data: { userId, topicId, editorialId },
      include: { topic: { include: { subject: true } } },
    });
  }

  // ── Remove bookmark ───────────────────────────────────────────────────────
  async removeBookmark(userId: string, bookmarkId: string) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: { id: bookmarkId, userId },
    });
    if (!bookmark) throw new NotFoundException('Bookmark not found');

    await this.prisma.bookmark.delete({ where: { id: bookmarkId } });
    return { message: 'Bookmark removed' };
  }

  // ── Get progress ──────────────────────────────────────────────────────────
  async getProgress(userId: string) {
    return this.prisma.userProgress.findMany({
      where: { userId },
      orderBy: { lastViewedAt: 'desc' },
      include: { topic: { include: { subject: true } } },
    });
  }

  // ── Update progress ───────────────────────────────────────────────────────
  async updateProgress(
    userId: string,
    topicId: string,
    progressPercent: number,
    completed: boolean,
  ) {
    return this.prisma.userProgress.upsert({
      where: { userId_topicId: { userId, topicId } },
      update: {
        progressPercent,
        completed,
        lastViewedAt: new Date(),
      },
      create: {
        userId,
        topicId,
        progressPercent,
        completed,
        lastViewedAt: new Date(),
      },
    });
  }

  // ── Get recently viewed ───────────────────────────────────────────────────
  async getRecentlyViewed(userId: string) {
    return this.prisma.recentlyViewed.findMany({
      where: { userId },
      orderBy: { viewedAt: 'desc' },
      take: 10,
      include: { topic: { include: { subject: true } } },
    });
  }
}
