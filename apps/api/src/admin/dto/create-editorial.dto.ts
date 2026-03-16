import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateEditorialDto {
  @ApiProperty()
  @IsString()
  topicId!: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsString()
  slug!: string;

  @ApiProperty()
  @IsString()
  summary!: string;

  @ApiProperty()
  @IsString()
  markdownContent!: string;

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
