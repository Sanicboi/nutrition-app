import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import jwt from "jsonwebtoken";
import { manager } from "..";
import bcrypt from "bcrypt";
import { FindOptionsRelations } from "typeorm";
export interface AuthRequest<ReqBody = any> extends Request<any, any, ReqBody> {
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

  public static async login(
    req: Request<
      any,
      any,
      {
        username: string;
        password: string;
      }
    >,
    res: Response,
  ): Promise<any> {
    if (!req.body || !req.body.username || !req.body.password)
      return res.status(400).end();

    const u = await manager.findOneBy(User, {
      username: req.body.username,
    });

    if (!u) return res.status(404).end();

    const result = await bcrypt.compare(req.body.password, u.password);
    if (!result) return res.status(401).end();

    const token = Auth.createToken(u.username);

    res.status(200).json({
      token,
    });
  }

  public static async signup(
    req: Request<
      any,
      any,
      {
        username: string;
        password: string;
      }
    >,
    res: Response,
  ): Promise<any> {
    if (!req.body || !req.body.username || !req.body.password)
      return res.status(400).end();

    let u = await manager.findOneBy(User, {
      username: req.body.username,
    });

    if (u) return res.status(409).end();

    u = new User();
    u.username = req.body.username;
    u.password = await bcrypt.hash(req.body.password, 12);
    await manager.save(u);

    const token = Auth.createToken(u.username);

    res.status(200).json({
      token,
    });
  }

  public static async authorizeDeletion(
    req: AuthRequest<{
      password: string;
    }>,
    response: Response,
  ): Promise<any> {
    const result = await bcrypt.compare(req.body.password, req.user.password);
    if (result) {
      const token = Auth.createToken(req.user.username, true);
      response.status(201).json({
        token,
      });
      return;
    }
    response.status(401).end();
  }

  public static async delete(req: AuthRequest, res: Response): Promise<any> {
    try {
      const token = req.header("X-Deletion-Token");
      if (!token || typeof token !== "string")
        throw new Error("No deletion token");
      const payload = jwt.verify(token, process.env.JWT_KEY);
      if (typeof payload == "string" || !payload.username || !payload.deletion)
        throw new Error("Invalid token payload");
      if (payload.username !== req.user.username)
        throw new Error("Invalid username");
      await manager.delete(User, req.user.username);
      res.status(204).end();
    } catch (e) {
      console.log(e);
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
