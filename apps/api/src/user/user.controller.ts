import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { UserService } from "./user.service";

type AuthenticatedRequest = Request & {
  user: {
    sub: string;
  };
};

@Controller("api/v1/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("dashboard")
  async getDashboard(@Req() req: AuthenticatedRequest) {
    return {
      message: "Dashboard fetched successfully",
      data: await this.userService.getDashboard(req.user.sub)
    };
  }
}
