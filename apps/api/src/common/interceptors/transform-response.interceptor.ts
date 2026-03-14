import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, unknown> {
  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((payload: unknown) => {
        if (
          payload &&
          typeof payload === "object" &&
          "data" in (payload as Record<string, unknown>) &&
          "message" in (payload as Record<string, unknown>)
        ) {
          return {
            success: true,
            ...(payload as Record<string, unknown>)
          };
        }

        return {
          success: true,
          message: "Request successful",
          data: payload
        };
      })
    );
  }
}
