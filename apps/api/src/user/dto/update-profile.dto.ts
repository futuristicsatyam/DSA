// apps/api/src/user/dto/update-profile.dto.ts
import { IsString, MinLength, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Alex Kumar' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;
}
