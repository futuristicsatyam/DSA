import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateEditorialDto {
  @ApiProperty()
  @IsString()
  topicId!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(180)
  title!: string;

  @ApiProperty()
  @IsString()
  summary!: string;

  @ApiProperty()
  @IsString()
  markdownContent!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  tags!: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  estimatedMinutes?: number;

  @ApiProperty()
  @IsBoolean()
  published!: boolean;
}

export class UpdateEditorialDto extends CreateEditorialDto {}
