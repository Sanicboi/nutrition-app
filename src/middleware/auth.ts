import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import jwt from "jsonwebtoken"
import { manager } from "..";
export interface AuthRequest extends Request {
    user: User;
}


const authorize = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const [type, token] = req.headers.authorization.split(" ");
        if (type !== "Bearer") throw new Error("Wrong Auth Type");
        const result = jwt.verify(token, process.env.JWT_KEY);
        if (typeof result == "string" || !result.username) throw new Error("Wrong token payload");
        const u = await manager.findOneBy(User, {
            username: result.username
        });
        if (!u) throw new Error("User not found");
        
    } catch (error) {
        console.error(error)
        res.status(401).end();
    }
}