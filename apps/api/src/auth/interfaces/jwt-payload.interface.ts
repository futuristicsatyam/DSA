import { Role } from "@prisma/client";

export interface JwtPayload {
  sub: string;
  email?: string | null;
  phone?: string | null;
  role: Role;
}
