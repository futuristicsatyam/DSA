import { Injectable, NotFoundException } from "@nestjs/common";
import { CategoryType, Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { RedisService } from "../cache/redis.service";

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService
  ) {}

  private subjectsCacheKey(category: CategoryType) {
    return `content:${category}:subjects`;
  }

  async getSubjects(categoryType: CategoryType) {
    const cacheKey = this.subjectsCacheKey(categoryType);
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return {
        message: "Subjects fetched from cache",
        data: cached
      };
    }

    const subjects = await this.prisma.subject.findMany({
      where: {
        categoryType,
        parentId: null
      },
      orderBy: { name: "asc" },
      include: {
        children: {
          orderBy: { name: "asc" },
          include: {
            topics: {
              orderBy: { orderIndex: "asc" },
              include: {
                editorials: {
                  where: { published: true },
                  take: 1
                }
              }
            }
          }
        },
        topics: {
          orderBy: { orderIndex: "asc" },
          include: {
            editorials: {
              where: { published: true },
              take: 1
            }
          }
        }
      }
    });

    await this.redis.set(cacheKey, subjects, 300);

    return {
      message: "Subjects fetched successfully",
      data: subjects
    };
  }

  async getTopicBySlug(slug: string, categoryType: CategoryType) {
    const topic = await this.prisma.topic.findFirst({
      where: {
        slug,
        subject: {
          categoryType
        }
      },
      include: {
        subject: true,
        editorials: {
          where: { published: true },
          orderBy: { updatedAt: "desc" }
        }
      }
    });

    if (!topic) {
      throw new NotFoundException("Topic not found");
    }

    return {
      message: "Topic fetched successfully",
      data: topic
    };
  }

  async getEditorialBySlug(slug: string) {
    const editorial = await this.prisma.editorial.findUnique({
      where: { slug },
      include: {
        topic: {
          include: {
            subject: true
          }
        }
      }
    });

    if (!editorial || !editorial.published) {
      throw new NotFoundException("Editorial not found");
    }

    return {
      message: "Editorial fetched successfully",
      data: editorial
    };
  }

  async search(query = "") {
    const normalized = query.trim();
    if (!normalized) {
      return {
        message: "Search completed",
        data: {
          subjects: [],
          topics: [],
          editorials: []
        }
      };
    }

    const searchTerm = normalized;

    const subjects = await this.prisma.$queryRaw<
      Array<{ id: string; name: string; slug: string; description: string; categoryType: CategoryType }>
    >(Prisma.sql`
      SELECT id, name, slug, description, "categoryType"
      FROM "Subject"
      WHERE to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
      @@ plainto_tsquery('english', ${searchTerm})
      ORDER BY ts_rank(
        to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')),
        plainto_tsquery('english', ${searchTerm})
      ) DESC
      LIMIT 8
    `);

    const topics = await this.prisma.$queryRaw<
      Array<{ id: string; title: string; slug: string; shortDescription: string; categoryType: CategoryType }>
    >(Prisma.sql`
      SELECT "Topic".id, "Topic".title, "Topic".slug, "Topic"."shortDescription", "Subject"."categoryType"
      FROM "Topic"
      INNER JOIN "Subject" ON "Subject".id = "Topic"."subjectId"
      WHERE to_tsvector('english', coalesce("Topic".title, '') || ' ' || coalesce("Topic"."shortDescription", ''))
      @@ plainto_tsquery('english', ${searchTerm})
      ORDER BY ts_rank(
        to_tsvector('english', coalesce("Topic".title, '') || ' ' || coalesce("Topic"."shortDescription", '')),
        plainto_tsquery('english', ${searchTerm})
      ) DESC
      LIMIT 10
    `);

    const editorials = await this.prisma.$queryRaw<
      Array<{ id: string; title: string; slug: string; summary: string; tags: string[] }>
    >(Prisma.sql`
      SELECT id, title, slug, summary, tags
      FROM "Editorial"
      WHERE published = true
      AND to_tsvector('english', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || array_to_string(tags, ' '))
      @@ plainto_tsquery('english', ${searchTerm})
      ORDER BY ts_rank(
        to_tsvector('english', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || array_to_string(tags, ' ')),
        plainto_tsquery('english', ${searchTerm})
      ) DESC
      LIMIT 10
    `);

    return {
      message: "Search completed",
      data: { subjects, topics, editorials }
    };
  }

  async invalidateCategoryCache(categoryType: CategoryType) {
    await this.redis.del(this.subjectsCacheKey(categoryType));
  }
}
