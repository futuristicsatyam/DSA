import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { ACCESS_TOKEN_COOKIE } from "../../common/constants";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.[ACCESS_TOKEN_COOKIE] ?? null,
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
      ignoreExpiration: false,
      secretOrKey: secretOrKey: configService.getOrThrow("JWT_ACCESS_SECRET")
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
