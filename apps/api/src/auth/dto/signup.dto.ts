import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, Matches, MaxLength, MinLength } from "class-validator";

export class SignupDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(120)
  fullName!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsPhoneNumber("IN")
  phoneNumber!: string;

  @ApiProperty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message: "Password must include uppercase, lowercase, number, and special character"
  })
  password!: string;

  @ApiProperty()
  @IsNotEmpty()
  confirmPassword!: string;
}
