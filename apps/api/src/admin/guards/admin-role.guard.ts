import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class AdminRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as { role?: string } | undefined;

    if (!user) {
      throw new ForbiddenException("User not found");
    }

    if (user.role !== "ADMIN") {
      throw new ForbiddenException("Admin access required");
    }

    return true;
  }
}
