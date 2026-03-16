import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { REFRESH_TOKEN_COOKIE } from "../../common/constants";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.[REFRESH_TOKEN_COOKIE] ?? null
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
      passReqToCallback: true
    });
  }

  validate(request: Request, payload: JwtPayload) {
    return {
      ...payload,
      refreshToken: request.cookies?.[REFRESH_TOKEN_COOKIE] ?? null
    };
  }
}
