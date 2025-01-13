import express, { Request } from "express"
import bodyParser from "body-parser"
import { AppDataSource } from "./data-source"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { User } from "./entity/User"
export const manager = AppDataSource.manager;
require("dotenv").config()
AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())



    app.post("/api/login", async (req: Request<any, any, {
        username: string
        password: string
    }>, res): Promise<any> => {
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
    })


    app.post("/api/signup", async (req: Request<any, any, {
        username: string;
        password: string;
    }>, res): Promise<any> => {
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
    });

    app.get("/api/me", async (req, res) => {
        
    })

    app.get("*", (req, res) => {
        res.status(200).json({
            ok: true
        });
    })





    // start express server
    app.listen(80)

}).catch(error => console.log(error))
