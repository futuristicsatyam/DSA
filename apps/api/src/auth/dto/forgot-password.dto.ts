import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({ description: "Email or phone number" })
  @IsNotEmpty()
  target!: string;
}
