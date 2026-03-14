import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ description: "Email or phone number" })
  @IsNotEmpty()
  identifier!: string;

  @ApiProperty()
  @MinLength(8)
  password!: string;
}
