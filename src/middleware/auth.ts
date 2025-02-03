import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import jwt from "jsonwebtoken";
import { manager } from "..";
import core from "express-serve-static-core";
import { FindOptionsRelations } from "typeorm";
export interface AuthRequest<
  ReqBody = any,
  QueryParams = qs.ParsedQs,
  Params = core.ParamsDictionary,
> extends Request<Params, any, ReqBody, QueryParams> {
  user: User;
}

export class Auth {
  public static async authenticate(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
    relations: FindOptionsRelations<User> = {},
  ) {
    try {
      const [type, token] = req.headers.authorization.split(" ");
      if (type !== "Bearer") throw new Error("Wrong Auth Type");
      const result = jwt.verify(token, process.env.JWT_KEY);
      if (typeof result == "string" || !result.username || result.deletion)
        throw new Error("Wrong token payload");
      const u = await manager.findOne(User, {
        where: {
          username: result.username,
        },
        relations,
      });
      if (!u) throw new Error("User not found");
      req.user = u;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).end();
    }
  }

  public static createToken(user: string, deletion: boolean = false): string {
    return jwt.sign(
      {
        deletion,
        username: user,
      },
      process.env.JWT_KEY,
      {
        expiresIn: deletion ? "3m" : "7d",
      },
    );
  }
}
