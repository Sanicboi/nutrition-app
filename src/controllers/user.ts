import { Request, Response } from "express";
import { manager } from "..";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import { Auth, AuthRequest } from "../middleware/auth";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";

interface IEditUser {
  username?: string;
  age?: number;
  weight?: number;
  height?: number;
  activityLevel?: 'low' | 'medium' | 'high' | 'professional';
}

export class UserController {
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

  public static async getMe(req: AuthRequest, res: Response): Promise<any> {
    res.status(200).json({
      username: req.user.username,
      age: req.user.age,
      activityLevel: req.user.activityLevel,
      height: req.user.height,
      weight: req.user.weight,
      filledProfile: req.user.filledProfile
    });
  }

  public static async editMe(
    req: AuthRequest<IEditUser>,
    res: Response,
  ): Promise<any> {
    if (req.body.username) {
      const u2 = await manager.findOneBy(User, {
        username: req.body.username,
      });
      if (u2) return res.status(409).end();
      req.user.username = req.body.username;
    }

    if (req.body.activityLevel)
      req.user.activityLevel = req.body.activityLevel;
    if (req.body.height)
      req.user.height = req.body.height;
    if (req.body.weight)
      req.user.weight = req.body.weight;
    if (req.body.age)
      req.user.age = req.body.age;
    if (!req.user.filledProfile)
      req.user.filledProfile = true;
    await manager.save(req.user);

    if (req.body.username) {
      const token = Auth.createToken(req.body.username);
      return res.status(200).json({
        token,
      });
    }

    res.status(204).end();
  }
}
