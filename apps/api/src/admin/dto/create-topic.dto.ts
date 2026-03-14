import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Difficulty } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateTopicDto {
  @ApiProperty()
  @IsString()
  subjectId!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(160)
  title!: string;

  @ApiProperty()
  @IsString()
  shortDescription!: string;

  @ApiPropertyOptional({ enum: Difficulty })
  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  orderIndex?: number;
}

export class UpdateTopicDto extends CreateTopicDto {}
