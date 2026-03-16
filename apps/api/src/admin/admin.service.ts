import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { ContentService } from "../content/content.service";
import { CreateEditorialDto } from "./dto/create-editorial.dto";
import { UpdateEditorialDto } from "./dto/update-editorial.dto";

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contentService: ContentService
  ) {}

  async getStats() {
  const [users, topics, editorials, bookmarks] = await Promise.all([
    this.prisma.user.count(),
    this.prisma.topic.count(),
    this.prisma.editorial.count(),
    this.prisma.bookmark.count()
  ]);

  return {
    message: "Admin stats fetched successfully",
    data: {
      users,
      topics,
      editorials,
      bookmarks
    }
  };
}

  async getAllEditorials() {
    const editorials = await this.prisma.editorial.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        topic: {
          include: {
            subject: true
          }
        }
      }
    });

    return {
      message: "Editorials fetched successfully",
      data: editorials
    };
  }

  async getEditorialById(id: string) {
    const editorial = await this.prisma.editorial.findUnique({
      where: { id },
      include: {
        topic: {
          include: {
            subject: true
          }
        }
      }
    });

    if (!editorial) {
      throw new NotFoundException("Editorial not found");
    }

    return {
      message: "Editorial fetched successfully",
      data: editorial
    };
  }

  async createEditorial(dto: CreateEditorialDto) {
    const topic = await this.prisma.topic.findUnique({
      where: { id: dto.topicId },
      include: {
        subject: true
      }
    });

    if (!topic) {
      throw new NotFoundException("Topic not found");
    }

    const editorial = await this.prisma.editorial.create({
      data: {
        topicId: dto.topicId,
        title: dto.title,
        slug: dto.slug,
        summary: dto.summary,
        markdownContent: dto.markdownContent,
        tags: dto.tags ?? [],
        estimatedMinutes: dto.estimatedMinutes,
        published: dto.published ?? false
      },
      include: {
        topic: {
          include: {
            subject: true
          }
        }
      }
    });

    await this.contentService.invalidateCategoryCache(topic.subject.categoryType);

    return {
      message: "Editorial created successfully",
      data: editorial
    };
  }

  async updateEditorial(id: string, dto: UpdateEditorialDto) {
    const existing = await this.prisma.editorial.findUnique({
      where: { id },
      include: {
        topic: {
          include: {
            subject: true
          }
        }
      }
    });

    if (!existing) {
      throw new NotFoundException("Editorial not found");
    }

    let categoryType = existing.topic.subject.categoryType;

    if (dto.topicId) {
      const newTopic = await this.prisma.topic.findUnique({
        where: { id: dto.topicId },
        include: {
          subject: true
        }
      });

      if (!newTopic) {
        throw new NotFoundException("New topic not found");
      }

      categoryType = newTopic.subject.categoryType;
    }

    const editorial = await this.prisma.editorial.update({
      where: { id },
      data: {
        topicId: dto.topicId,
        title: dto.title,
        slug: dto.slug,
        summary: dto.summary,
        markdownContent: dto.markdownContent,
        tags: dto.tags,
        estimatedMinutes: dto.estimatedMinutes,
        published: dto.published
      },
      include: {
        topic: {
          include: {
            subject: true
          }
        }
      }
    });

    await this.contentService.invalidateCategoryCache(categoryType);

    return {
      message: "Editorial updated successfully",
      data: editorial
    };
  }

  async publishEditorial(id: string) {
    const editorial = await this.prisma.editorial.findUnique({
      where: { id },
      include: {
        topic: {
          include: {
            subject: true
          }
        }
      }
    });

    if (!editorial) {
      throw new NotFoundException("Editorial not found");
    }

    const updated = await this.prisma.editorial.update({
      where: { id },
      data: { published: true },
      include: {
        topic: {
          include: {
            subject: true
          }
        }
      }
    });

    await this.contentService.invalidateCategoryCache(editorial.topic.subject.categoryType);

    return {
      message: "Editorial published successfully",
      data: updated
    };
  }

  async unpublishEditorial(id: string) {
    const editorial = await this.prisma.editorial.findUnique({
      where: { id },
      include: {
        topic: {
          include: {
            subject: true
          }
        }
      }
    });

    if (!editorial) {
      throw new NotFoundException("Editorial not found");
    }

    const updated = await this.prisma.editorial.update({
      where: { id },
      data: { published: false },
      include: {
        topic: {
          include: {
            subject: true
          }
        }
      }
    });

    await this.contentService.invalidateCategoryCache(editorial.topic.subject.categoryType);

    return {
      message: "Editorial unpublished successfully",
      data: updated
    };
  }

  async deleteEditorial(id: string) {
    const editorial = await this.prisma.editorial.findUnique({
      where: { id },
      include: {
        topic: {
          include: {
            subject: true
          }
        }
      }
    });

    if (!editorial) {
      throw new NotFoundException("Editorial not found");
    }

    await this.prisma.editorial.delete({
      where: { id }
    });

    await this.contentService.invalidateCategoryCache(editorial.topic.subject.categoryType);

    return {
      message: "Editorial deleted successfully",
      data: null
    };
  }
}
