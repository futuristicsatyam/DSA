import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches, MinLength } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  target!: string;

  @ApiProperty()
  @IsNotEmpty()
  code!: string;

  @ApiProperty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message: "Password must include uppercase, lowercase, number, and special character"
  })
  newPassword!: string;
}
