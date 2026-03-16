import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdateEditorialDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  topicId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  markdownContent?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  estimatedMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
