import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string, type?: string) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId,
        ...(type ? { type: type as never } : {})
      },
      orderBy: { createdAt: "desc" },
      include: {
        topic: true,
        editorial: true
      }
    });

    return {
      message: "Bookmarks fetched successfully",
      data: bookmarks
    };
  }

  async create(userId: string, dto: CreateBookmarkDto) {
    if (!dto.topicId && !dto.editorialId && !dto.problemId) {
      throw new BadRequestException("At least one bookmark target is required");
    }

    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto
      }
    });

    return {
      message: "Bookmark created successfully",
      data: bookmark
    };
  }

  async remove(userId: string, bookmarkId: string) {
    await this.prisma.bookmark.deleteMany({
      where: {
        id: bookmarkId,
        userId
      }
    });

    return {
      message: "Bookmark removed successfully",
      data: null
    };
  }
}
