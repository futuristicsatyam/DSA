import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BookmarkType } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class CreateBookmarkDto {
  @ApiProperty({ enum: BookmarkType })
  @IsEnum(BookmarkType)
  type!: BookmarkType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  topicId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  editorialId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  problemId?: string;
}
