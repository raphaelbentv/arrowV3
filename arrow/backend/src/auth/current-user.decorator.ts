import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "./interfaces/user.interface";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Omit<User, "password"> => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user: Omit<User, "password"> }>();
    return request.user;
  },
);
