import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { BookmarksService } from "./bookmarks.service";

@ApiTags("Bookmarks")
@ApiBearerAuth()
@Controller("api/v1/user/bookmarks")
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  list(@CurrentUser() user: { sub: string }, @Query("type") type?: string) {
    return this.bookmarksService.list(user.sub, type);
  }

  @Post()
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateBookmarkDto) {
    return this.bookmarksService.create(user.sub, dto);
  }

  @Delete(":id")
  remove(@CurrentUser() user: { sub: string }, @Param("id") id: string) {
    return this.bookmarksService.remove(user.sub, id);
  }
}
