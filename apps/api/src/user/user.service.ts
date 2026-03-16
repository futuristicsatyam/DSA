import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const continueLearning = await this.prisma.userProgress.findMany({
      where: {
        userId,
        progressPercent: { gt: 0, lt: 100 }
      },
      orderBy: {
        updatedAt: "desc"
      },
      take: 5,
      include: {
        topic: {
          include: {
            subject: true
          }
        }
      }
    });

    const recentlyViewed = await this.prisma.recentlyViewed.findMany({
      where: { userId },
      orderBy: {
        viewedAt: "desc"
      },
      take: 5,
      include: {
        topic: {
          include: {
            subject: true
          }
        }
      }
    });

    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc"
      },
      take: 5,
      include: {
        topic: true,
        editorial: true
      }
    });

    const completedCount = await this.prisma.userProgress.count({
      where: {
        userId,
        completed: true
      }
    });

    const totalTopics = await this.prisma.topic.count();

    const percent =
      totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

    const recommendations = await this.prisma.topic.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        subject: true
      }
    });

    const now = new Date();
    const weeklyActivity = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - index));
      return {
        date: date.toISOString().slice(0, 10),
        count: 0
      };
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
      progressSummary: {
        completedCount,
        totalTopics,
        percent
      },
      streak: 0,
      weeklyActivity,
      recommendations
    };
  }
}
