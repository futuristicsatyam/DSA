import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CategoryType } from "@prisma/client";
import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateSubjectDto {
  @ApiProperty()
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty({ enum: CategoryType })
  @IsEnum(CategoryType)
  categoryType!: CategoryType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class UpdateSubjectDto extends CreateSubjectDto {}
