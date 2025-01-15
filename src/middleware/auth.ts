import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import jwt from "jsonwebtoken"
import { manager } from "..";
import bcrypt from "bcrypt"
export interface AuthRequest extends Request {
    user: User;
}



export class Auth {
    public static async authenticate(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const [type, token] = req.headers.authorization.split(" ");
            if (type !== "Bearer") throw new Error("Wrong Auth Type");
            const result = jwt.verify(token, process.env.JWT_KEY);
            if (typeof result == "string" || !result.username) throw new Error("Wrong token payload");
            const u = await manager.findOneBy(User, {
                username: result.username
            });
            if (!u) throw new Error("User not found");
            req.user = u;
            next();
        } catch (error) {
            console.error(error)
            res.status(401).end();
        }
    }

    public static async login(req: Request<any, any, {
        username: string
        password: string
    }>, res: Response): Promise<any> {
        if (!req.body || !req.body.username || !req.body.password) return res.status(400).end();

        const u = await manager.findOneBy(User, {
            username: req.body.username
        })

        if (!u) return res.status(404).end();

        const result = await bcrypt.compare(req.body.password, u.password);
        if (!result) return res.status(401).end();

        const token = jwt.sign({
            username: u.username
        }, process.env.JWT_KEY, {
            expiresIn: "7d"
        });

        res.status(200).json({
            token,
        })
    }

    public static async signup(req: Request<any, any, {
        username: string;
        password: string;
    }>, res: Response) : Promise<any> {
        if (!req.body || !req.body.username || !req.body.password) return res.status(400).end();

        let u = await manager.findOneBy(User, {
            username: req.body.username
        })

        if (u) return res.status(409).end();
        
        u = new User();
        u.username = req.body.username;
        u.password = await bcrypt.hash(req.body.password, 12);
        await manager.save(u);

        const token = jwt.sign({
            username: u.username
        }, process.env.JWT_KEY, {
            expiresIn: "7d"
        });

        res.status(200).json({
            token,
        })
    }
}


